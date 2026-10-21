/**
 * Servicio de conexión a la API PHP conectada a MySQL en XAMPP
 */

const API_BASE = '/api';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'worker' | 'admin';
  city: string;
  avatar_url?: string;
}

export interface ClientRegistrationPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url?: string;
  services_interested: string[];
  language: string;
  department: string;
  city: string;
  neighborhood: string;
  geolocation_lat?: number | null;
  geolocation_lng?: number | null;
  how_heard: string;
  service_frequency: string;
  preferred_payment: string;
}

export interface WorkerRegistrationPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url?: string;
  has_vehicle: boolean;
  vehicle_type: 'moto' | 'carro' | 'bicicleta' | 'a_pie';
  vehicle_name: string;
  vehicle_plate: string;
  vehicle_photo?: string;
  job_role: string;
  is_professional: boolean;
  cert_or_work_photo?: string;
  tools_verified: string[];
  city: string;
}

export const apiService = {
  // Iniciar sesión con contraseña encriptada (XAMPP MySQL)
  async login(email: string, password: string, role: 'client' | 'worker') {
    const res = await fetch(`${API_BASE}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return res.json();
  },

  // Solicitar código de recuperación de contraseña (expira en 5 minutos)
  async requestPasswordRecovery(email: string) {
    const res = await fetch(`${API_BASE}?action=forgot_password_request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Restablecer contraseña con código de 6 dígitos
  async resetPassword(email: string, code: string, newPassword: string) {
    const res = await fetch(`${API_BASE}?action=reset_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });
    return res.json();
  },

  // Registro de Cliente con preferencias y encuesta
  async registerClient(payload: ClientRegistrationPayload) {
    const res = await fetch(`${API_BASE}?action=register_client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Registro de Trabajador con vehículo, certificado y herramientas
  async registerWorker(payload: WorkerRegistrationPayload) {
    const res = await fetch(`${API_BASE}?action=register_worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Solicitar código de verificación 2FA con captcha
  async sendVerificationCode(email: string, captchaAnswer: string, expectedCaptcha: string) {
    const res = await fetch(`${API_BASE}?action=send_verification_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        captcha_answer: captchaAnswer,
        expected_captcha: expectedCaptcha,
      }),
    });
    return res.json();
  },

  // Validar código y autenticar
  async verifyAndLogin(email: string, password: string, code: string, role: 'client' | 'worker') {
    const res = await fetch(`${API_BASE}?action=verify_and_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, code, role }),
    });
    return res.json();
  },

  // Validar token de sesión para evitar saltarse el logeo
  async validateSession(sessionToken: string, role: 'client' | 'worker') {
    try {
      const res = await fetch(`${API_BASE}?action=validate_session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken, role }),
      });
      return res.json();
    } catch (err) {
      return { success: false, message: 'No se pudo conectar al servidor PHP/MySQL' };
    }
  },

  // Obtener técnicos reales de la base de datos MySQL
  async getTechnicians(city: string = 'neiva') {
    try {
      const res = await fetch(`${API_BASE}?action=get_technicians&city=${encodeURIComponent(city)}`);
      return res.json();
    } catch (err) {
      return { success: false, technicians: [] };
    }
  },

  // Obtener camellos activos
  async getJobs() {
    try {
      const res = await fetch(`${API_BASE}?action=get_jobs`);
      return res.json();
    } catch (err) {
      return { success: false, jobs: [] };
    }
  },

  // Crear nuevo camello
  async createJob(jobData: any) {
    const res = await fetch(`${API_BASE}?action=create_job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    return res.json();
  },

  // Actualizar estado del camello
  async updateJobStatus(jobId: string, status: string) {
    const res = await fetch(`${API_BASE}?action=update_job_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, status }),
    });
    return res.json();
  },

  // Enviar mensaje de chat
  async sendChatMessage(jobId: string, sender: 'client' | 'technician', message: string) {
    const res = await fetch(`${API_BASE}?action=send_chat_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, sender, message }),
    });
    return res.json();
  },

  // Obtener oportunidades del radar (Trabajador)
  async getWorkerRadar() {
    try {
      const res = await fetch(`${API_BASE}?action=get_worker_radar`);
      return res.json();
    } catch (err) {
      return { success: false, opportunities: [] };
    }
  },

  // Aceptar oportunidad (Trabajador)
  async acceptOpportunity(oppId: number | string) {
    const res = await fetch(`${API_BASE}?action=accept_opportunity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity_id: oppId }),
    });
    return res.json();
  },

  // Retirar saldo (Trabajador)
  async workerWithdraw(userId: number, platform: string) {
    const res = await fetch(`${API_BASE}?action=worker_withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, platform }),
    });
    return res.json();
  },
};
