<?php
/**
 * REST API Endpoint Principal para Échele Camello
 * Conectado a MySQL en XAMPP
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

// Obtener datos enviados en JSON o POST
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true) ?? $_POST;
$action = $_GET['action'] ?? $data['action'] ?? '';

// Aplicar Rate Limiting cibernético general (60 peticiones por minuto por IP)
checkRateLimit($pdo, $action ?: 'general', 100, 60);

switch ($action) {

    // =========================================================================
    // 1. SOLICITAR CÓDIGO DE VERIFICACIÓN (2FA / REGISTRO) CON PHPMAILER
    // =========================================================================
    case 'send_verification_code':
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $captcha_answer = trim($data['captcha_answer'] ?? '');
        $expected_captcha = trim($data['expected_captcha'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Por favor ingresa un correo electrónico válido."]);
            exit();
        }

        // Validación de captcha contra bots
        if ($captcha_answer !== '' && $expected_captcha !== '' && $captcha_answer !== $expected_captcha) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "El captcha ingresado es incorrecto. Intenta de nuevo."]);
            exit();
        }

        // Generar código numérico criptográficamente seguro de 6 dígitos
        $code = strval(random_int(100000, 999999));
        $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutos de validez

        // Invalidar códigos anteriores del mismo correo
        $stmt_inv = $pdo->prepare("UPDATE verification_codes SET is_used = 1 WHERE email = ? AND is_used = 0");
        $stmt_inv->execute([$email]);

        // Guardar nuevo código
        $stmt = $pdo->prepare("INSERT INTO verification_codes (email, code, purpose, expires_at) VALUES (?, ?, 'login_2fa', ?)");
        $stmt->execute([$email, $code, $expires_at]);

        // Enviar correo mediante PHPMailer / Mailer
        $mail_result = sendVerificationEmail($email, $code);

        echo json_encode([
            "success" => true,
            "message" => "Código de 6 dígitos enviado exitosamente a {$email}.",
            // El debug_code permite que el usuario pruebe de inmediato en local si no tiene SMTP configurado en XAMPP
            "debug_code" => $code,
            "expires_in_minutes" => 10
        ]);
        break;

    // =========================================================================
    // 2. VERIFICAR CÓDIGO Y AUTENTICAR (CLIENTE O TRABAJADOR)
    // =========================================================================
    case 'verify_and_login':
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $password = $data['password'] ?? '';
        $code = trim($data['code'] ?? '');
        $role = in_array($data['role'] ?? '', ['client', 'worker']) ? $data['role'] : 'client';

        if (!$email || !$code) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Debes suministrar el correo y el código de verificación."]);
            exit();
        }

        // Validar código en la base de datos
        $stmt_code = $pdo->prepare("
            SELECT id, code, expires_at 
            FROM verification_codes 
            WHERE email = ? AND is_used = 0 AND expires_at > NOW() 
            ORDER BY id DESC LIMIT 1
        ");
        $stmt_code->execute([$email]);
        $valid_code = $stmt_code->fetch();

        if (!$valid_code || $valid_code['code'] !== $code) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "El código de verificación es inválido o ya ha expirado."]);
            exit();
        }

        // Marcar código como usado
        $pdo->prepare("UPDATE verification_codes SET is_used = 1 WHERE id = ?")->execute([$valid_code['id']]);

        // Buscar o crear usuario
        $stmt_user = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt_user->execute([$email]);
        $user = $stmt_user->fetch();

        if (!$user) {
            // Registro automático si es la primera vez que ingresa con verificación
            $name = explode('@', $email)[0];
            $name = ucwords(str_replace(['.', '_', '-'], ' ', $name));
            $pwd_hash = password_hash($password ?: 'Camello2026!', PASSWORD_BCRYPT);
            
            $stmt_new = $pdo->prepare("INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, '+57 300 000 0000')");
            $stmt_new->execute([$name, $email, $pwd_hash, $role]);
            $user_id = $pdo->lastInsertId();

            $user = [
                "id" => $user_id,
                "name" => $name,
                "email" => $email,
                "role" => $role,
                "city" => "neiva"
            ];

            // Si es trabajador, crear billetera inicial
            if ($role === 'worker') {
                $pdo->prepare("INSERT IGNORE INTO worker_wallets (user_id, balance_cop) VALUES (?, 450000)")->execute([$user_id]);
            }
        } else {
            // Si el usuario especificó cambio de rol explícito en el formulario
            if (!empty($data['role']) && $user['role'] !== $data['role']) {
                $pdo->prepare("UPDATE users SET role = ? WHERE id = ?")->execute([$data['role'], $user['id']]);
                $user['role'] = $data['role'];
            }
        }

        // Generar Session Token Criptográfico Aleatorio para la URL SPA (#session-<token>)
        $session_token = bin2hex(random_bytes(32));
        $session_expires = date('Y-m-d H:i:s', time() + (24 * 3600)); // 24 horas

        $stmt_sess = $pdo->prepare("INSERT INTO sessions (user_id, session_token, role, ip_address, expires_at) VALUES (?, ?, ?, ?, ?)");
        $stmt_sess->execute([$user['id'], $session_token, $user['role'], $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', $session_expires]);

        echo json_encode([
            "success" => true,
            "message" => "Autenticación exitosa.",
            "session_token" => $session_token,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role'],
                "city" => $user['city'] ?? 'neiva'
            ]
        ]);
        break;

    // =========================================================================
    // 3. VALIDAR TOKEN DE SESIÓN (PROTECCIÓN ANTI-BYPASS)
    // =========================================================================
    case 'validate_session':
        $token = $data['session_token'] ?? $_GET['session_token'] ?? '';
        $expected_role = $data['role'] ?? $_GET['role'] ?? '';

        if (!$token) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Token no suministrado."]);
            exit();
        }

        $stmt = $pdo->prepare("
            SELECT s.session_token, s.role, s.expires_at, u.id as user_id, u.name, u.email, u.city 
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.session_token = ? AND s.expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $sess = $stmt->fetch();

        if (!$sess) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Sesión inválida o expirada. Debes logearte."]);
            exit();
        }

        if ($expected_role && $sess['role'] !== $expected_role) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "No tienes permisos para esta área."]);
            exit();
        }

        echo json_encode([
            "success" => true,
            "valid" => true,
            "user" => [
                "id" => $sess['user_id'],
                "name" => $sess['name'],
                "email" => $sess['email'],
                "role" => $sess['role'],
                "city" => $sess['city']
            ]
        ]);
        break;

    // =========================================================================
    // 4. LISTAR TÉCNICOS Y SERVICIOS DESDE MYSQL
    // =========================================================================
    case 'get_technicians':
        $city = $_GET['city'] ?? $data['city'] ?? 'neiva';

        $stmt = $pdo->prepare("SELECT * FROM technicians WHERE city = ? ORDER BY rating DESC");
        $stmt->execute([$city]);
        $technicians = $stmt->fetchAll();

        // Para cada técnico, adjuntar sus servicios y reseñas reales
        foreach ($technicians as &$tech) {
            // Desglosar barrios
            $tech['neighborhoods'] = array_map('trim', explode(',', $tech['neighborhoods']));
            $tech['visitFeeCOP'] = intval($tech['visit_fee_cop']);
            $tech['rating'] = floatval($tech['rating']);
            $tech['completedJobs'] = intval($tech['completed_jobs']);
            $tech['experienceYears'] = intval($tech['experience_years']);
            $tech['isAvailableNow'] = (bool)$tech['is_available_now'];
            $tech['responseTimeMinutes'] = intval($tech['response_time_minutes']);
            $tech['idVerified'] = (bool)$tech['id_verified'];
            $tech['policeBackgroundCheck'] = (bool)$tech['police_background_check'];
            $tech['senaCertified'] = (bool)$tech['sena_certified'];
            $tech['arlActive'] = (bool)$tech['arl_active'];
            $tech['categoryId'] = $tech['category_id'];
            $tech['categoryName'] = $tech['category_name'];
            $tech['avatarColor'] = $tech['avatar_color'];

            // Servicios
            $stmt_serv = $pdo->prepare("SELECT title, description, price_cop as priceCOP, estimated_time as estimatedTime FROM technician_services WHERE technician_id = ?");
            $stmt_serv->execute([$tech['id']]);
            $tech['services'] = $stmt_serv->fetchAll();

            // Reseñas
            $stmt_rev = $pdo->prepare("SELECT id, author, rating, comment, service, neighborhood, city, review_date as date FROM reviews WHERE technician_id = ? ORDER BY id DESC LIMIT 5");
            $stmt_rev->execute([$tech['id']]);
            $tech['recentReviews'] = $stmt_rev->fetchAll();
        }

        echo json_encode([
            "success" => true,
            "city" => $city,
            "total" => count($technicians),
            "technicians" => $technicians
        ]);
        break;

    // =========================================================================
    // 5. CAMELLOS ACTIVOS (LISTAR, CREAR, ACTUALIZAR)
    // =========================================================================
    case 'get_jobs':
        $stmt = $pdo->prepare("SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10");
        $stmt->execute();
        $jobs = $stmt->fetchAll();

        foreach ($jobs as &$j) {
            $j['estimatedCostCOP'] = intval($j['estimated_cost_cop']);
            $j['etaMinutes'] = intval($j['eta_minutes']);
            $j['isGuaranteeActive'] = (bool)$j['is_guarantee_active'];
            $j['problemTitle'] = $j['problem_title'];
            $j['scheduledTime'] = $j['scheduled_time'];
            $j['paymentMethod'] = $j['payment_method'];

            // Adjuntar técnico
            $stmt_t = $pdo->prepare("SELECT * FROM technicians WHERE id = ?");
            $stmt_t->execute([$j['technician_id']]);
            $tech = $stmt_t->fetch();
            if ($tech) {
                $tech['avatarColor'] = $tech['avatar_color'];
                $tech['rating'] = floatval($tech['rating']);
                $tech['completedJobs'] = intval($tech['completed_jobs']);
                $j['technician'] = $tech;
            }

            // Adjuntar mensajes de chat
            $stmt_m = $pdo->prepare("SELECT id, sender, message as text, DATE_FORMAT(created_at, '%h:%i %p') as time FROM job_messages WHERE job_id = ? ORDER BY id ASC");
            $stmt_m->execute([$j['id']]);
            $j['chatMessages'] = $stmt_m->fetchAll();
        }

        echo json_encode(["success" => true, "jobs" => $jobs]);
        break;

    case 'create_job':
        $job_id = $data['id'] ?? ('job-' . time() . '-' . rand(100, 999));
        $code = $data['code'] ?? ('CAM-' . rand(1000, 9999));
        $technician_id = intval($data['technician_id'] ?? 1);
        $category = $data['category'] ?? 'plomeria';
        $problem_title = $data['problemTitle'] ?? 'Servicio Solicitado';
        $description = $data['description'] ?? '';
        $address = $data['address'] ?? 'Dirección Domicilio';
        $city = $data['city'] ?? 'Neiva (Huila)';
        $neighborhood = $data['neighborhood'] ?? 'Quirinal';
        $scheduled_time = $data['scheduledTime'] ?? 'Inmediato (25 min)';
        $estimated_cost_cop = intval($data['estimatedCostCOP'] ?? 75000);
        $payment_method = $data['paymentMethod'] ?? 'nequi';

        $stmt = $pdo->prepare("
            INSERT INTO jobs (id, code, technician_id, category, problem_title, description, address, city, neighborhood, scheduled_time, estimated_cost_cop, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $job_id, $code, $technician_id, $category, $problem_title, $description, $address, $city, $neighborhood, $scheduled_time, $estimated_cost_cop, $payment_method
        ]);

        // Mensaje inicial del sistema
        $stmt_msg = $pdo->prepare("INSERT INTO job_messages (job_id, sender, message) VALUES (?, 'system', ?)");
        $stmt_msg->execute([$job_id, "¡Camello {$code} confirmado y protegido con Garantía Camello!"]);

        echo json_encode(["success" => true, "job_id" => $job_id, "code" => $code]);
        break;

    case 'update_job_status':
        $job_id = $data['job_id'] ?? '';
        $new_status = $data['status'] ?? '';
        $valid_statuses = ['solicitado', 'en_camino', 'en_diagnostico', 'en_ejecucion', 'completado'];

        if ($job_id && in_array($new_status, $valid_statuses)) {
            $stmt = $pdo->prepare("UPDATE jobs SET status = ? WHERE id = ?");
            $stmt->execute([$new_status, $job_id]);

            // Mensaje en el chat informando cambio de estado
            $status_labels = [
                'en_camino' => 'El técnico va en camino a tu domicilio.',
                'en_diagnostico' => 'El técnico ha iniciado el diagnóstico.',
                'en_ejecucion' => 'El trabajo está en ejecución bajo protocolos de seguridad.',
                'completado' => 'El trabajo ha sido marcado como Terminado y Aprobado.'
            ];
            if (isset($status_labels[$new_status])) {
                $pdo->prepare("INSERT INTO job_messages (job_id, sender, message) VALUES (?, 'system', ?)")
                    ->execute([$job_id, $status_labels[$new_status]]);
            }

            echo json_encode(["success" => true, "status" => $new_status]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Estado o ID inválido."]);
        }
        break;

    case 'send_chat_message':
        $job_id = $data['job_id'] ?? '';
        $sender = in_array($data['sender'] ?? '', ['client', 'technician']) ? $data['sender'] : 'client';
        $message = trim($data['message'] ?? '');

        if ($job_id && $message) {
            $stmt = $pdo->prepare("INSERT INTO job_messages (job_id, sender, message) VALUES (?, ?, ?)");
            $stmt->execute([$job_id, $sender, $message]);
            echo json_encode([
                "success" => true,
                "message_id" => $pdo->lastInsertId(),
                "time" => date('h:i A')
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Mensaje no puede estar vacío."]);
        }
        break;

    // =========================================================================
    // 6. PANEL TRABAJADOR: RADAR, BILLETERA & RETIROS
    // =========================================================================
    case 'get_worker_radar':
        $stmt = $pdo->prepare("SELECT * FROM opportunities WHERE is_taken = 0 ORDER BY id DESC");
        $stmt->execute();
        $opps = $stmt->fetchAll();
        foreach ($opps as &$o) {
            $o['distanceKm'] = floatval($o['distance_km']);
            $o['offerCOP'] = intval($o['offer_cop']);
            $o['categoryName'] = $o['category_name'];
            $o['postedAgo'] = $o['posted_ago'];
        }
        echo json_encode(["success" => true, "opportunities" => $opps]);
        break;

    case 'accept_opportunity':
        $opp_id = intval($data['opportunity_id'] ?? 0);
        if ($opp_id > 0) {
            $stmt = $pdo->prepare("UPDATE opportunities SET is_taken = 1 WHERE id = ?");
            $stmt->execute([$opp_id]);
            echo json_encode(["success" => true, "message" => "¡Camello aceptado! El cliente te está esperando."]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID de oportunidad no válido."]);
        }
        break;

    case 'worker_withdraw':
        $user_id = intval($data['user_id'] ?? 2);
        $platform = trim($data['platform'] ?? 'Nequi');
        
        $stmt_w = $pdo->prepare("SELECT balance_cop FROM worker_wallets WHERE user_id = ?");
        $stmt_w->execute([$user_id]);
        $wallet = $stmt_w->fetch();
        $balance = intval($wallet['balance_cop'] ?? 0);

        if ($balance > 0) {
            $pdo->prepare("UPDATE worker_wallets SET balance_cop = 0, last_payout = NOW() WHERE user_id = ?")->execute([$user_id]);
            $pdo->prepare("INSERT INTO wallet_transactions (user_id, type, amount_cop, platform, title) VALUES (?, 'withdrawal', ?, ?, 'Transferencia completada')")
                ->execute([$user_id, $balance, $platform]);

            echo json_encode([
                "success" => true,
                "amount_withdrawn" => $balance,
                "message" => "¡Transferencia de $" . number_format($balance, 0, ',', '.') . " COP enviada exitosamente a {$platform}!"
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No tienes saldo disponible para retirar."]);
        }
        break;

    // =========================================================================
    // 12. INICIO DE SESIÓN CON CONTRASEÑA ENCRIPTADA (CLIENTE / TRABAJADOR)
    // =========================================================================
    case 'login':
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $password = $data['password'] ?? '';
        $role = in_array($data['role'] ?? '', ['client', 'worker']) ? $data['role'] : 'client';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Ingresa un correo electrónico válido y tu contraseña."]);
            exit();
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "No existe una cuenta registrada con este correo."]);
            exit();
        }

        if (!password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta. Verifica e intenta de nuevo."]);
            exit();
        }

        // Generar Session Token
        $session_token = bin2hex(random_bytes(32));
        $session_expires = date('Y-m-d H:i:s', time() + (24 * 3600));
        $stmt_sess = $pdo->prepare("INSERT INTO sessions (user_id, session_token, role, ip_address, expires_at) VALUES (?, ?, ?, ?, ?)");
        $stmt_sess->execute([$user['id'], $session_token, $user['role'], $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', $session_expires]);

        echo json_encode([
            "success" => true,
            "message" => "Sesión iniciada correctamente.",
            "session_token" => $session_token,
            "token" => $session_token,
            "role" => $user['role'],
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role'],
                "city" => $user['city'] ?? 'neiva'
            ]
        ]);
        break;

    // =========================================================================
    // 13. REGISTRO DE CLIENTE CON ENCRIPTACIÓN Y PREFERENCIAS ONBOARDING
    // =========================================================================
    case 'register_client':
        $first_name = trim($data['first_name'] ?? '');
        $last_name = trim($data['last_name'] ?? '');
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $password = $data['password'] ?? '';
        $avatar_url = $data['avatar_url'] ?? '';
        $services_interested = isset($data['services_interested']) ? (is_array($data['services_interested']) ? json_encode($data['services_interested'], JSON_UNESCAPED_UNICODE) : $data['services_interested']) : '[]';
        $language = trim($data['language'] ?? 'Español');
        $department = trim($data['department'] ?? 'Huila');
        $city = trim($data['city'] ?? 'neiva');
        $neighborhood = trim($data['neighborhood'] ?? '');
        $geo_lat = !empty($data['geolocation_lat']) ? floatval($data['geolocation_lat']) : null;
        $geo_lng = !empty($data['geolocation_lng']) ? floatval($data['geolocation_lng']) : null;
        $how_heard = trim($data['how_heard'] ?? 'Redes Sociales');
        $service_frequency = trim($data['service_frequency'] ?? 'Emergencias imprevistas');
        $preferred_payment = trim($data['preferred_payment'] ?? 'nequi');

        if (empty($first_name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nombre, correo y contraseña son obligatorios."]);
            exit();
        }

        $stmt_check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt_check->execute([$email]);
        if ($stmt_check->fetch()) {
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "Ya existe una cuenta con este correo. Por favor inicia sesión."]);
            exit();
        }

        $full_name = trim("{$first_name} {$last_name}");
        $pwd_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt_user = $pdo->prepare("INSERT INTO users (name, email, password_hash, role, city) VALUES (?, ?, ?, 'client', ?)");
        $stmt_user->execute([$full_name, $email, $pwd_hash, strtolower($city)]);
        $user_id = $pdo->lastInsertId();

        $stmt_prof = $pdo->prepare("INSERT INTO client_profiles 
            (user_id, first_name, last_name, avatar_url, services_interested, language, department, city, neighborhood, geolocation_lat, geolocation_lng, how_heard, service_frequency, preferred_payment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt_prof->execute([
            $user_id, $first_name, $last_name, $avatar_url, $services_interested, $language, $department, $city, $neighborhood, $geo_lat, $geo_lng, $how_heard, $service_frequency, $preferred_payment
        ]);

        $session_token = bin2hex(random_bytes(32));
        $session_expires = date('Y-m-d H:i:s', time() + (24 * 3600));
        $pdo->prepare("INSERT INTO sessions (user_id, session_token, role, ip_address, expires_at) VALUES (?, ?, 'client', ?, ?)")
            ->execute([$user_id, $session_token, $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', $session_expires]);

        echo json_encode([
            "success" => true,
            "message" => "¡Bienvenido a Échele Camello! Registro completado exitosamente.",
            "session_token" => $session_token,
            "token" => $session_token,
            "role" => "client",
            "user" => [
                "id" => $user_id,
                "name" => $full_name,
                "email" => $email,
                "role" => "client",
                "city" => strtolower($city),
                "avatar_url" => $avatar_url
            ]
        ]);
        break;

    // =========================================================================
    // 14. REGISTRO DE TRABAJADOR (VEHÍCULO, EVIDENCIAS, HERRAMIENTAS, ENCRIPTACIÓN)
    // =========================================================================
    case 'register_worker':
        $first_name = trim($data['first_name'] ?? '');
        $last_name = trim($data['last_name'] ?? '');
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $password = $data['password'] ?? '';
        $avatar_url = $data['avatar_url'] ?? '';
        $has_vehicle = !empty($data['has_vehicle']) ? 1 : 0;
        $vehicle_type = in_array($data['vehicle_type'] ?? '', ['moto', 'carro', 'bicicleta', 'a_pie']) ? $data['vehicle_type'] : 'moto';
        $vehicle_name = trim($data['vehicle_name'] ?? '');
        $vehicle_plate = strtoupper(trim($data['vehicle_plate'] ?? ''));
        $vehicle_photo = $data['vehicle_photo'] ?? '';
        $job_role = trim($data['job_role'] ?? 'Técnico Especialista');
        $is_professional = !empty($data['is_professional']) ? 1 : 0;
        $cert_or_work_photo = $data['cert_or_work_photo'] ?? '';
        $tools_verified = isset($data['tools_verified']) ? (is_array($data['tools_verified']) ? json_encode($data['tools_verified'], JSON_UNESCAPED_UNICODE) : $data['tools_verified']) : '[]';
        $city = trim($data['city'] ?? 'neiva');

        if (empty($first_name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nombre, correo y contraseña son obligatorios."]);
            exit();
        }

        $stmt_check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt_check->execute([$email]);
        if ($stmt_check->fetch()) {
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "Ya existe una cuenta con este correo. Por favor inicia sesión."]);
            exit();
        }

        $full_name = trim("{$first_name} {$last_name}");
        $pwd_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt_user = $pdo->prepare("INSERT INTO users (name, email, password_hash, role, city) VALUES (?, ?, ?, 'worker', ?)");
        $stmt_user->execute([$full_name, $email, $pwd_hash, strtolower($city)]);
        $user_id = $pdo->lastInsertId();

        $stmt_prof = $pdo->prepare("INSERT INTO worker_profiles 
            (user_id, first_name, last_name, avatar_url, has_vehicle, vehicle_type, vehicle_name, vehicle_plate, vehicle_photo, job_role, is_professional, cert_or_work_photo, tools_verified, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified')");
        $stmt_prof->execute([
            $user_id, $first_name, $last_name, $avatar_url, $has_vehicle, $vehicle_type, $vehicle_name, $vehicle_plate, $vehicle_photo, $job_role, $is_professional, $cert_or_work_photo, $tools_verified
        ]);

        // Registrar billetera con bono de bienvenida de $100.000 COP
        $pdo->prepare("INSERT INTO worker_wallets (user_id, balance_cop) VALUES (?, 100000)")->execute([$user_id]);

        $session_token = bin2hex(random_bytes(32));
        $session_expires = date('Y-m-d H:i:s', time() + (24 * 3600));
        $pdo->prepare("INSERT INTO sessions (user_id, session_token, role, ip_address, expires_at) VALUES (?, ?, 'worker', ?, ?)")
            ->execute([$user_id, $session_token, $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', $session_expires]);

        echo json_encode([
            "success" => true,
            "message" => "¡Registro completado! Tu perfil de trabajador ha sido verificado y activado.",
            "session_token" => $session_token,
            "token" => $session_token,
            "role" => "worker",
            "user" => [
                "id" => $user_id,
                "name" => $full_name,
                "email" => $email,
                "role" => "worker",
                "city" => strtolower($city),
                "avatar_url" => $avatar_url
            ]
        ]);
        break;

    // =========================================================================
    // 15. SOLICITUD DE RECUPERACIÓN DE CONTRASEÑA (EXPIRA EN 5 MINUTOS)
    // =========================================================================
    case 'forgot_password_request':
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Ingresa un correo electrónico válido."]);
            exit();
        }

        $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "No encontramos ninguna cuenta registrada con este correo."]);
            exit();
        }

        // Generar código de 6 dígitos con expiración exacta de 5 minutos
        $code = strval(random_int(100000, 999999));
        $expires_at = date('Y-m-d H:i:s', time() + (5 * 60)); // 5 minutos exactos

        // Invalidar códigos anteriores de este correo
        $pdo->prepare("UPDATE verification_codes SET is_used = 1 WHERE email = ? AND is_used = 0")->execute([$email]);

        // Guardar nuevo código
        $stmt_ins = $pdo->prepare("INSERT INTO verification_codes (email, code, purpose, expires_at) VALUES (?, ?, 'recovery', ?)");
        $stmt_ins->execute([$email, $code, $expires_at]);

        // Enviar correo con plantilla HTML especializada para recuperación (PHPMailer / Mailer)
        sendPasswordRecoveryEmail($email, $code, $user['name']);

        echo json_encode([
            "success" => true,
            "message" => "Hemos enviado un código de recuperación a tu correo. El código expira en 5 minutos.",
            "debug_code" => $code,
            "expires_in_seconds" => 300
        ]);
        break;

    // =========================================================================
    // 16. RESTABLECER CONTRASEÑA CON CÓDIGO
    // =========================================================================
    case 'reset_password':
        $email = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $code = trim($data['code'] ?? '');
        $new_password = $data['new_password'] ?? '';

        if (!$email || !$code || empty($new_password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Debes suministrar el correo, el código y la nueva contraseña."]);
            exit();
        }

        if (strlen($new_password) < 6) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "La nueva contraseña debe tener al menos 6 caracteres."]);
            exit();
        }

        // Validar que el código exista, no haya sido usado y no haya pasado de 5 minutos
        $stmt_code = $pdo->prepare("
            SELECT id, code, expires_at 
            FROM verification_codes 
            WHERE email = ? AND is_used = 0 AND expires_at > NOW() 
            ORDER BY id DESC LIMIT 1
        ");
        $stmt_code->execute([$email]);
        $valid_code = $stmt_code->fetch();

        if (!$valid_code || $valid_code['code'] !== $code) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "El código es incorrecto o ya ha expirado (límite de 5 minutos)."]);
            exit();
        }

        // Marcar código como usado
        $pdo->prepare("UPDATE verification_codes SET is_used = 1 WHERE id = ?")->execute([$valid_code['id']]);

        // Encriptar la nueva contraseña con bcrypt
        $new_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?")->execute([$new_hash, $email]);

        // Cerrar sesiones anteriores por seguridad
        $pdo->prepare("DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ? LIMIT 1)")->execute([$email]);

        echo json_encode([
            "success" => true,
            "message" => "¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión con tu nueva contraseña."
        ]);
        break;

    default:
        echo json_encode([
            "success" => true,
            "status" => "Échele Camello API v1.0 Activa",
            "database" => "MySQL XAMPP Conectada",
            "endpoints" => [
                "POST ?action=send_verification_code",
                "POST ?action=verify_and_login",
                "POST ?action=validate_session",
                "GET ?action=get_technicians&city=neiva",
                "GET ?action=get_jobs",
                "POST ?action=create_job",
                "POST ?action=update_job_status",
                "POST ?action=send_chat_message",
                "GET ?action=get_worker_radar",
                "POST ?action=accept_opportunity",
                "POST ?action=worker_withdraw"
            ]
        ]);
        break;
}
