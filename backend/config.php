<?php
/**
 * Configuración de Base de Datos y Seguridad para Échele Camello
 * Conexión a XAMPP MySQL mediante PDO
 */

// Headers CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Session-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = "localhost";
$db_name = "echele_camello_db";
$db_user = "root";
$db_pass = "";

// Configuración SMTP para PHPMailer (se puede configurar con Gmail, Outlook o Mailtrap)
$smtp_host = "smtp.gmail.com";
$smtp_port = 587;
$smtp_user = ""; // Coloca aquí tu correo si deseas enviar correos reales
$smtp_pass = ""; // Coloca aquí tu contraseña de aplicación
$smtp_secure = "tls";
$smtp_from_email = "seguridad@echelecamello.co";
$smtp_from_name = "Échele Camello Seguridad";


try {
    $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a MySQL en XAMPP: " . $e->getMessage()
    ]);
    exit();
}

/**
 * Ciberseguridad: Anti-spam y Rate Limiter
 * Evita ataques de fuerza bruta y recargas excesivas
 */
function checkRateLimit($pdo, $endpoint, $max_hits = 60, $window_seconds = 60) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $now = time();

    try {
        $stmt = $pdo->prepare("SELECT hits, window_start FROM rate_limits WHERE ip_address = ? AND endpoint = ?");
        $stmt->execute([$ip, $endpoint]);
        $row = $stmt->fetch();

        if ($row) {
            if ($now - $row['window_start'] > $window_seconds) {
                // Reiniciar ventana
                $update = $pdo->prepare("UPDATE rate_limits SET hits = 1, window_start = ? WHERE ip_address = ? AND endpoint = ?");
                $update->execute([$now, $ip, $endpoint]);
            } else {
                if ($row['hits'] >= $max_hits) {
                    http_response_code(429);
                    echo json_encode([
                        "success" => false,
                        "message" => "Límite de peticiones alcanzado. Por ciberseguridad, espera un minuto antes de reintentar."
                    ]);
                    exit();
                }
                $update = $pdo->prepare("UPDATE rate_limits SET hits = hits + 1 WHERE ip_address = ? AND endpoint = ?");
                $update->execute([$ip, $endpoint]);
            }
        } else {
            $insert = $pdo->prepare("INSERT INTO rate_limits (ip_address, endpoint, hits, window_start) VALUES (?, ?, 1, ?)");
            $insert->execute([$ip, $endpoint, $now]);
        }
    } catch (Exception $e) {
        // En caso de tabla bloqueada, permitir continuar
    }
}
