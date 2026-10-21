<?php
/**
 * Servicio de Envío de Correos con PHPMailer Oficial para Échele Camello
 */

// Cargar el autoloader oficial de Composer para PHPMailer
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * Crea e inicializa una instancia de PHPMailer con la configuración de XAMPP / SMTP
 */
function createPHPMailerInstance() {
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return null;
    }

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';

    // Obtener variables de configuración
    $smtp_host = $GLOBALS['smtp_host'] ?? 'smtp.gmail.com';
    $smtp_port = intval($GLOBALS['smtp_port'] ?? 587);
    $smtp_user = $GLOBALS['smtp_user'] ?? '';
    $smtp_pass = $GLOBALS['smtp_pass'] ?? '';
    $smtp_secure = ($GLOBALS['smtp_secure'] ?? 'tls') === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $from_email = !empty($GLOBALS['smtp_from_email']) ? $GLOBALS['smtp_from_email'] : ($smtp_user ?: 'seguridad@echelecamello.co');
    $from_name = $GLOBALS['smtp_from_name'] ?? 'Échele Camello Seguridad';

    // Si el usuario configuró credenciales SMTP, activar SMTP con autenticación
    if (!empty($smtp_user) && !empty($smtp_pass)) {
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_user;
        $mail->Password = $smtp_pass;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port = $smtp_port;
        // Compatibilidad con Windows / XAMPP para evitar rechazos de certificado SSL local
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];
    } else {
        // En local XAMPP sin SMTP externo, usa mail() estándar
        $mail->isMail();
    }

    $mail->setFrom($from_email, $from_name);
    return $mail;
}

/**
 * 1. Envía correo con código de verificación 2FA / Login
 */
function sendVerificationEmail($recipient_email, $code, $recipient_name = "Usuario") {
    $subject = "Tu código de verificación — Échele Camello";
    
    $html_body = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
      <meta charset='UTF-8'>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 24px; color: #1d1d1f; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.08); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #161617; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: -0.5px; }
        .header span { font-size: 11px; text-transform: uppercase; color: #f05023; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 32px 28px; text-align: center; }
        .greeting { font-size: 15px; color: #48484a; margin-bottom: 12px; }
        .code-box { display: inline-block; background: #f5f5f7; border: 2px dashed #f05023; border-radius: 14px; padding: 14px 28px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d1d1f; margin: 20px 0; font-family: monospace; }
        .footer { background: #fafafc; padding: 18px; border-top: 1px solid #f0f0f2; font-size: 11px; color: #86868b; text-align: center; }
      </style>
    </head>
    <body>
      <div class='card'>
        <div class='header'>
          <span>Seguridad Échele Camello</span>
          <h1>Verificación de Acceso 2FA</h1>
        </div>
        <div class='content'>
          <p class='greeting'>Hola <strong>" . htmlspecialchars($recipient_name) . "</strong>,</p>
          <p style='font-size: 13px; color: #6e6e73; line-height: 1.5;'>Usa el siguiente código de 6 dígitos para ingresar de forma segura a tu cuenta en la plataforma.</p>
          <div class='code-box'>" . htmlspecialchars($code) . "</div>
          <p style='font-size: 12px; color: #86868b;'>Este código es válido por 10 minutos. Si tú no solicitaste este acceso, puedes ignorar este mensaje.</p>
        </div>
        <div class='footer'>
          © 2026 Échele Camello S.A.S. · Red de Técnicos y Maestros de Colombia
        </div>
      </div>
    </body>
    </html>
    ";

    $smtp_user = $GLOBALS['smtp_user'] ?? '';
    $smtp_pass = $GLOBALS['smtp_pass'] ?? '';
    if (empty($smtp_user) || empty($smtp_pass)) {
        return [
            "success" => false,
            "email_dispatched" => false,
            "recipient" => $recipient_email,
            "error" => "No se han configurado las credenciales SMTP en backend/config.php ($smtp_user y $smtp_pass). Configura un correo y contraseña de aplicación para enviar correos reales."
        ];
    }

    $sent = false;
    $error_info = '';

    // Intentar con PHPMailer oficial
    try {
        $mail = createPHPMailerInstance();
        if ($mail) {
            $mail->addAddress($recipient_email, $recipient_name);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $html_body;
            $mail->AltBody = "Tu código de verificación es: {$code}";
            $sent = $mail->send();
        } else {
            $error_info = "No se pudo inicializar PHPMailer.";
        }
    } catch (Exception $e) {
        $sent = false;
        $error_info = (isset($mail) && $mail) ? $mail->ErrorInfo : $e->getMessage();
    }

    return [
        "success" => $sent,
        "email_dispatched" => $sent,
        "recipient" => $recipient_email,
        "error" => $sent ? null : ($error_info ?: "No se pudo entregar el correo mediante SMTP.")
    ];
}

/**
 * 2. Envía correo con código de recuperación de contraseña (expira en 5 minutos)
 */
function sendPasswordRecoveryEmail($recipient_email, $code, $recipient_name = "Usuario") {
    $subject = "Recuperación de contraseña — Échele Camello";
    
    $html_body = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
      <meta charset='UTF-8'>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 24px; color: #1d1d1f; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.08); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #c2410c; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: -0.5px; }
        .header span { font-size: 11px; text-transform: uppercase; color: #ffedd5; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 32px 28px; text-align: center; }
        .greeting { font-size: 15px; color: #48484a; margin-bottom: 12px; }
        .code-box { display: inline-block; background: #fff7ed; border: 2px dashed #c2410c; border-radius: 14px; padding: 14px 28px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #c2410c; margin: 20px 0; font-family: monospace; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px; font-size: 12px; color: #b91c1c; margin-top: 15px; }
        .footer { background: #fafafc; padding: 18px; border-top: 1px solid #f0f0f2; font-size: 11px; color: #86868b; text-align: center; }
      </style>
    </head>
    <body>
      <div class='card'>
        <div class='header'>
          <span>Seguridad Échele Camello</span>
          <h1>Recuperación de Contraseña</h1>
        </div>
        <div class='content'>
          <p class='greeting'>Hola <strong>" . htmlspecialchars($recipient_name) . "</strong>,</p>
          <p style='font-size: 13px; color: #6e6e73; line-height: 1.5;'>Has solicitado restablecer la contraseña de tu cuenta en Échele Camello. Ingresa el siguiente código temporal:</p>
          <div class='code-box'>" . htmlspecialchars($code) . "</div>
          <div class='alert-box'>
            ⏱️ <strong>Importante:</strong> Este código expira en <strong>5 minutos</strong> por seguridad cibernética. Si no fuiste tú quien solicitó este cambio, no compartas este código con nadie.
          </div>
        </div>
        <div class='footer'>
          © 2026 Échele Camello S.A.S. · Red de Técnicos y Maestros de Colombia
        </div>
      </div>
    </body>
    </html>
    ";

    $smtp_user = $GLOBALS['smtp_user'] ?? '';
    $smtp_pass = $GLOBALS['smtp_pass'] ?? '';
    if (empty($smtp_user) || empty($smtp_pass)) {
        return [
            "success" => false,
            "email_dispatched" => false,
            "recipient" => $recipient_email,
            "error" => "No se han configurado las credenciales SMTP en backend/config.php ($smtp_user y $smtp_pass). Configura un correo y contraseña de aplicación para enviar correos reales."
        ];
    }

    $sent = false;
    $error_info = '';

    // Intentar con PHPMailer oficial
    try {
        $mail = createPHPMailerInstance();
        if ($mail) {
            $mail->addAddress($recipient_email, $recipient_name);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $html_body;
            $mail->AltBody = "Tu código de recuperación de contraseña es: {$code}. Expira en 5 minutos.";
            $sent = $mail->send();
        } else {
            $error_info = "No se pudo inicializar PHPMailer.";
        }
    } catch (Exception $e) {
        $sent = false;
        $error_info = (isset($mail) && $mail) ? $mail->ErrorInfo : $e->getMessage();
    }

    return [
        "success" => $sent,
        "email_dispatched" => $sent,
        "recipient" => $recipient_email,
        "error" => $sent ? null : ($error_info ?: "No se pudo entregar el correo mediante SMTP.")
    ];
}
