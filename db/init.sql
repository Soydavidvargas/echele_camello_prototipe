-- ==============================================================
-- BASE DE DATOS PARA ÉCHELE CAMELLO (XAMPP MYSQL)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `echele_camello_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `echele_camello_db`;

-- 1. Tabla de Usuarios (Clientes y Trabajadores)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('client', 'worker', 'admin') NOT NULL DEFAULT 'client',
  `phone` VARCHAR(30) NULL,
  `city` VARCHAR(50) DEFAULT 'neiva',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Códigos de Verificación para Logeo 2FA / PHPMailer / Recuperación
CREATE TABLE IF NOT EXISTS `verification_codes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `code` VARCHAR(8) NOT NULL,
  `purpose` ENUM('login_2fa', 'register', 'recovery') DEFAULT 'login_2fa',
  `is_used` TINYINT(1) DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`email`),
  INDEX (`code`)
) ENGINE=InnoDB;

-- 3. Sesiones Seguras con Token Aleatorio (Anti-Bypass)
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_token` VARCHAR(128) NOT NULL UNIQUE,
  `role` ENUM('client', 'worker', 'admin') NOT NULL,
  `ip_address` VARCHAR(60) NULL,
  `user_agent` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Seguridad Cibernética: Control de Tráfico & Anti-Reload Spam
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `ip_address` VARCHAR(60) NOT NULL,
  `endpoint` VARCHAR(100) NOT NULL,
  `hits` INT DEFAULT 1,
  `window_start` INT NOT NULL,
  PRIMARY KEY (`ip_address`, `endpoint`)
) ENGINE=InnoDB;

-- 5. Técnicos y Maestros Verificados
CREATE TABLE IF NOT EXISTS `technicians` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `name` VARCHAR(120) NOT NULL,
  `nickname` VARCHAR(80) NULL,
  `title` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `category_name` VARCHAR(80) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `city_name` VARCHAR(80) NOT NULL,
  `neighborhoods` TEXT NOT NULL,
  `avatar_color` VARCHAR(50) DEFAULT 'bg-orange-600',
  `initials` VARCHAR(5) NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `completed_jobs` INT DEFAULT 0,
  `experience_years` INT DEFAULT 5,
  `is_available_now` TINYINT(1) DEFAULT 1,
  `response_time_minutes` INT DEFAULT 30,
  `id_verified` TINYINT(1) DEFAULT 1,
  `police_background_check` TINYINT(1) DEFAULT 1,
  `sena_certified` TINYINT(1) DEFAULT 1,
  `arl_active` TINYINT(1) DEFAULT 1,
  `visit_fee_cop` INT NOT NULL DEFAULT 45000,
  `bio` TEXT NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Servicios y Tarifas por Técnico
CREATE TABLE IF NOT EXISTS `technician_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `technician_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `price_cop` INT NOT NULL,
  `estimated_time` VARCHAR(80) NOT NULL,
  FOREIGN KEY (`technician_id`) REFERENCES `technicians`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Reseñas Verificadas
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `technician_id` INT NOT NULL,
  `author` VARCHAR(120) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `service` VARCHAR(150) NOT NULL,
  `neighborhood` VARCHAR(100) NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `review_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`technician_id`) REFERENCES `technicians`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Camellos Activos y Realizados (Jobs)
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `client_id` INT NULL,
  `technician_id` INT NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `problem_title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `neighborhood` VARCHAR(120) NOT NULL,
  `scheduled_time` VARCHAR(120) NOT NULL,
  `status` ENUM('solicitado', 'en_camino', 'en_diagnostico', 'en_ejecucion', 'completado') DEFAULT 'solicitado',
  `eta_minutes` INT DEFAULT 25,
  `estimated_cost_cop` INT NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'nequi',
  `is_guarantee_active` TINYINT(1) DEFAULT 1,
  `rating` INT NULL,
  `review_comment` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Mensajes de Chat en Vivo
CREATE TABLE IF NOT EXISTS `job_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` VARCHAR(64) NOT NULL,
  `sender` ENUM('client', 'technician', 'system') NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Radar de Oportunidades para Trabajadores
CREATE TABLE IF NOT EXISTS `opportunities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(50) NOT NULL,
  `category_name` VARCHAR(80) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `neighborhood` VARCHAR(120) NOT NULL,
  `distance_km` DECIMAL(3,1) DEFAULT 1.5,
  `offer_cop` INT NOT NULL,
  `posted_ago` VARCHAR(50) DEFAULT 'Hace 5 min',
  `is_taken` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Billetera de Trabajador
CREATE TABLE IF NOT EXISTS `worker_wallets` (
  `user_id` INT PRIMARY KEY,
  `balance_cop` INT NOT NULL DEFAULT 485000,
  `completed_month_jobs` INT NOT NULL DEFAULT 26,
  `punctuality_percent` DECIMAL(4,1) NOT NULL DEFAULT 98.2,
  `last_payout` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Historial de Retiros / Pagos
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('income', 'withdrawal') NOT NULL,
  `amount_cop` INT NOT NULL,
  `platform` VARCHAR(80) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. Perfiles Detallados de Cliente y Encuesta de Onboarding
CREATE TABLE IF NOT EXISTS `client_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `avatar_url` LONGTEXT NULL,
  `services_interested` TEXT NULL,
  `language` VARCHAR(50) DEFAULT 'Español',
  `department` VARCHAR(80) NULL,
  `city` VARCHAR(80) NULL,
  `neighborhood` VARCHAR(120) NULL,
  `geolocation_lat` DECIMAL(10, 7) NULL,
  `geolocation_lng` DECIMAL(10, 7) NULL,
  `how_heard` VARCHAR(100) NULL,
  `service_frequency` VARCHAR(80) NULL,
  `preferred_payment` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Perfiles Detallados de Trabajador (Vehículo, Evidencias, Herramientas)
CREATE TABLE IF NOT EXISTS `worker_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `avatar_url` LONGTEXT NULL,
  `has_vehicle` TINYINT(1) DEFAULT 1,
  `vehicle_type` ENUM('moto', 'carro', 'bicicleta', 'a_pie') DEFAULT 'moto',
  `vehicle_name` VARCHAR(100) NULL,
  `vehicle_plate` VARCHAR(20) NULL,
  `vehicle_photo` LONGTEXT NULL,
  `job_role` VARCHAR(100) NOT NULL,
  `is_professional` TINYINT(1) DEFAULT 1,
  `cert_or_work_photo` LONGTEXT NULL,
  `tools_verified` TEXT NULL,
  `verification_status` ENUM('approved', 'pending_review', 'verified') DEFAULT 'verified',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================
-- INSERCIÓN DE DATOS REALES FUNCIONALES
-- ==============================================================

-- Usuarios de prueba predeterminados (Hash bcrypt de 'Camello2026!' y 'Maestro2026!')
-- password_hash generado para 'Camello2026!': $2y$10$wT0E02n34P4K0uFhG9hTne76r9Xj5KkU1N.R1oB8eWqZ7l8uM4m3O
-- password_hash generado para 'Maestro2026!': $2y$10$8h6Ff1y.K8kG5V6oN4pPuuP0F9J7qL8rB9n1M2o4P6r8T0v2X4z6q
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`, `city`) VALUES
(1, 'Carlos Eduardo Pérez', 'cliente@echelecamello.co', '$2y$10$wT0E02n34P4K0uFhG9hTne76r9Xj5KkU1N.R1oB8eWqZ7l8uM4m3O', 'client', '+57 312 456 7890', 'neiva'),
(2, 'Don Jairo Bermúdez', 'trabajador@echelecamello.co', '$2y$10$8h6Ff1y.K8kG5V6oN4pPuuP0F9J7qL8rB9n1M2o4P6r8T0v2X4z6q', 'worker', '+57 311 492 8821', 'bogota'),
(3, 'Orlando Tovar Gómez', 'orlando@echelecamello.co', '$2y$10$8h6Ff1y.K8kG5V6oN4pPuuP0F9J7qL8rB9n1M2o4P6r8T0v2X4z6q', 'worker', '+57 315 220 1199', 'neiva')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Billetera inicial para trabajador
INSERT INTO `worker_wallets` (`user_id`, `balance_cop`, `completed_month_jobs`, `punctuality_percent`) VALUES
(2, 485000, 26, 98.2),
(3, 310000, 18, 97.5)
ON DUPLICATE KEY UPDATE `balance_cop`=VALUES(`balance_cop`);

-- Técnicos Certificados
INSERT INTO `technicians` (`id`, `user_id`, `name`, `nickname`, `title`, `category_id`, `category_name`, `city`, `city_name`, `neighborhoods`, `avatar_color`, `initials`, `rating`, `completed_jobs`, `experience_years`, `is_available_now`, `response_time_minutes`, `id_verified`, `police_background_check`, `sena_certified`, `arl_active`, `visit_fee_cop`, `bio`, `phone`) VALUES
(1, 3, 'Orlando Tovar Gómez', 'Maestro Orlando', 'Plomero & Redes Hidrosanitarias', 'plomeria', 'Plomería & Destapes', 'neiva', 'Neiva (Huila)', 'Quirinal, Ipanema, Las Ceibas, Altico, Cándido', 'bg-blue-600', 'OT', 4.96, 218, 14, 1, 20, 1, 1, 1, 1, 35000, 'Especialista en fugas de agua no destructivas con geófono, destapes con sonda eléctrica K-50 y cambio de griferías. Más de 14 años prestando servicio en toda la Comuna 1 y 2 de Neiva.', '+57 315 220 1199'),
(2, NULL, 'Luis Hernando Perdomo', 'Don Lucho', 'Cerrajero de Seguridad 24/7', 'cerrajeria', 'Cerrajería 24/7', 'neiva', 'Neiva (Huila)', 'Ipanema, Buganviles, Altico, Centro, Sevilla', 'bg-amber-600', 'LP', 4.91, 174, 9, 1, 15, 1, 1, 1, 1, 30000, 'Apertura de cerraduras de seguridad, candados de alta gama, cambio de guardas y duplicados a domicilio en motocicleta en menos de 20 minutos en Neiva.', '+57 312 884 9901'),
(3, NULL, 'Camilo Andrés Trujillo', 'El Chispas', 'Electricista Certificado Conte / SENA', 'electricidad', 'Electricidad & Redes', 'neiva', 'Neiva (Huila)', 'Cándido, Santa Inés, Las Granjas, Chicalá, Quirinal', 'bg-yellow-600', 'CT', 4.88, 142, 8, 1, 25, 1, 1, 1, 1, 40000, 'Técnico electricista para cortocircuitos, instalación de breakers termomagnéticos, iluminación LED industrial y domiciliaria bajo norma RETIE.', '+57 318 643 2210'),
(4, NULL, 'Gustavo Adolfo Dussán', 'Técnico Gustavo', 'Especialista en Refrigeración y Lavadoras', 'electrodomesticos', 'Electrodomésticos', 'neiva', 'Neiva (Huila)', 'La Toma, Calixto Leyva, Timanco, Canaima, Jardín', 'bg-emerald-600', 'GD', 4.94, 205, 11, 1, 35, 1, 1, 1, 1, 45000, 'Reparación de lavadoras Samsung, LG, Whirlpool y Mabe. Mantenimiento preventivo de aires acondicionados Mini Split y neveras No-Frost.', '+57 310 771 4455'),
(5, NULL, 'Édgar Fabián Sterling', 'Maestro Édgar', 'Pintor Profesional & Acabados Drywall', 'pintura', 'Pintura & Resanes', 'neiva', 'Neiva (Huila)', 'Altico, Quirinal, Ipanema, Microcentro, Prado Alto', 'bg-purple-600', 'ES', 4.85, 96, 7, 0, 45, 1, 1, 0, 1, 30000, 'Pintura interior con vinilo tipo 1 lavable Koraza, estuco veneciano, resanes de humedades y colocación de molduras de yeso y Drywall.', '+57 314 902 3311'),
(6, 2, 'Jairo Bermúdez', 'Don Jairo', 'Plomero Hidráulico Certificado SENA', 'plomeria', 'Plomería & Destapes', 'bogota', 'Bogotá D.C.', 'Cedritos, Usaquén, Chapinero, Chicó, Teusaquillo', 'bg-orange-600', 'JB', 4.94, 184, 12, 1, 25, 1, 1, 1, 1, 45000, 'Maestro técnico especialista en tuberías de PVC, CPVC y cobre, detección de filtraciones en apartamentos y bombas de presión para conjuntos residenciales.', '+57 311 492 8821')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Tarifas por técnico
INSERT INTO `technician_services` (`technician_id`, `title`, `description`, `price_cop`, `estimated_time`) VALUES
(1, 'Destape de Sifón o Lavamanos', 'Uso de guaya mecánica sin romper baldosas con garantía de flujo libre.', 65000, '40 min'),
(1, 'Cambio de Mezclador de Ducha', 'Reemplazo de vástago o mezclador con prueba de presión hidráulica.', 85000, '1 h 15 min'),
(1, 'Reparación de Flotador de Sanitario', 'Ajuste o cambio de válvula de entrada Fluidmaster y sello sapito.', 50000, '30 min'),
(2, 'Apertura de Chapa Principal de Seguridad', 'Técnica de ganzuado profesional sin dañar la puerta ni el marco.', 60000, '25 min'),
(2, 'Cambio de Guardas y Cilindro', 'Sustitución de clave con 3 llaves nuevas de seguridad anti-taladro.', 75000, '45 min'),
(3, 'Diagnóstico y Arreglo de Cortocircuito', 'Rastreo con multímetro de línea aterrizada y cambio de breaker quemado.', 70000, '50 min'),
(3, 'Instalación de Punto Eléctrico 110V/220V', 'Canalización con tubería conduit y cable certificado calibre 12.', 80000, '1 h 30 min'),
(4, 'Mantenimiento Preventivo de Aire Acondicionado', 'Lavado con hidrolavadora a presión, desinfección de serpentín y gas R410A.', 90000, '1 h 20 min'),
(6, 'Destape de Tubería Principal de 3 Pulgadas', 'Sonda eléctrica industrial para desagüe de cocina y bajantes.', 85000, '1 h')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Reseñas
INSERT INTO `reviews` (`technician_id`, `author`, `rating`, `comment`, `service`, `neighborhood`, `city`, `review_date`) VALUES
(1, 'Carolina Bahamón', 5, 'El señor Orlando llegó en 20 minutos en su moto a Quirinal, arregló el tubo del lavaplatos que estaba inundando la cocina. Muy educado y cobró lo justo.', 'Fuga bajo lavaplatos', 'Quirinal', 'Neiva', 'Hace 2 días'),
(1, 'Hernando Cuéllar', 5, 'Excelente maestro. Traía todas las herramientas y repuestos listos. Quedó garantizado.', 'Cambio de grifería', 'Ipanema', 'Neiva', 'Hace 1 semana'),
(2, 'Marcela Cabrera', 5, 'Me dejó las llaves adentro a las 10 de la noche y en 15 minutos Don Lucho me abrió la puerta sin romper nada. Servicio de 10 estrellas.', 'Apertura nocturna', 'Altico', 'Neiva', 'Ayer')
ON DUPLICATE KEY UPDATE `author`=VALUES(`author`);

-- Camello Activo Inicial para el cliente
INSERT INTO `jobs` (`id`, `code`, `client_id`, `technician_id`, `category`, `problem_title`, `description`, `address`, `city`, `neighborhood`, `scheduled_time`, `status`, `eta_minutes`, `estimated_cost_cop`, `payment_method`, `is_guarantee_active`) VALUES
('job-init-1', 'CAM-7842', 1, 1, 'plomeria', 'Fuga de agua bajo el lavaplatos y sifón suelto', 'Goteo continuo que está humedeciendo el mueble de madera de la cocina.', 'Carrera 8 # 14-38, Apto 402', 'Neiva (Huila)', 'Quirinal', 'Inmediato (Técnico en camino)', 'en_camino', 18, 75000, 'nequi', 1)
ON DUPLICATE KEY UPDATE `code`=VALUES(`code`);

-- Mensajes de chat iniciales para el camello activo
INSERT INTO `job_messages` (`job_id`, `sender`, `message`) VALUES
('job-init-1', 'system', '¡Camello asignado con éxito! Técnico verificado Orlando Tovar Gómez va en camino a tu domicilio.'),
('job-init-1', 'technician', '¡Buenas tardes don Carlos! Ya voy saliendo por la Carrera 7 con mi moto COF-82D. Llevo la sonda y empaques nuevos.'),
('job-init-1', 'client', 'Buenas tardes don Orlando, listo, lo espero en portería del Edificio Los Samanes.'),
('job-init-1', 'technician', '¡Enterado mi estimado! En 15 minutos estoy tocando citófono.')
ON DUPLICATE KEY UPDATE `message`=VALUES(`message`);

-- Oportunidades activas en el Radar para Trabajadores
INSERT INTO `opportunities` (`id`, `category`, `category_name`, `title`, `description`, `city`, `neighborhood`, `distance_km`, `offer_cop`, `posted_ago`, `is_taken`) VALUES
(1, 'plomeria', 'Plomería', 'Destape urgente de sifón de patio', 'Se devolvió el agua del lavadero durante el aguacero de anoche.', 'Neiva', 'Ipanema', 1.2, 65000, 'Hace 4 min', 0),
(2, 'cerrajeria', 'Cerrajería', 'Apertura de puerta de alcoba trancada', 'La perilla quedó girando en falso con la llave adentro.', 'Neiva', 'Quirinal', 0.8, 55000, 'Hace 9 min', 0),
(3, 'electricidad', 'Electricidad', 'Breaker se dispara al encender la estufa', 'Posible sobrecarga en el circuito secundario del tablero.', 'Neiva', 'Las Ceibas', 2.1, 75000, 'Hace 15 min', 0)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);
