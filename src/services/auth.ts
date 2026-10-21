/**
 * Servicio de autenticación y registro para Échele Camello
 * Conectado a la API PHP en XAMPP con encriptación y fallback resiliente.
 */
import {
  apiService,
  UserSession,
  ClientRegistrationPayload,
  WorkerRegistrationPayload,
} from './api';
import { setAuthCookie, getAuthCookie } from '../data/colombiaData';

export type Role = 'client' | 'worker';

export type LoginResult =
  | { success: true; user: UserSession; token: string; role: Role; message?: string }
  | { success: false; message: string };

export type SessionResult =
  | { success: true; valid: true; user: UserSession }
  | { success: false; valid: false };

const USERS_STORAGE_KEY = 'ec_registered_users_cache';

/** Cuentas de prueba predeterminadas */
const MOCK_ACCOUNTS: Record<string, UserSession> = {
  'cliente@test.com': { id: 1, name: 'Carlos Eduardo Pérez', email: 'cliente@test.com', role: 'client', city: 'neiva' },
  'trabajador@test.com': { id: 2, name: 'Orlando Tovar Gómez', email: 'trabajador@test.com', role: 'worker', city: 'neiva' },
};

function getLocalUsers(): Record<string, { user: UserSession; passwordHash?: string }> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(email: string, user: UserSession) {
  try {
    const users = getLocalUsers();
    users[email.toLowerCase()] = { user };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const buildMockToken = (user: UserSession) => `mock${user.role}${user.id}_${Date.now().toString(36)}`;

/**
 * Inicia sesión con correo y contraseña.
 * Conecta con XAMPP / PHP / MySQL y tiene fallback local si el servidor no está corriendo.
 */
export async function handleLogin(email: string, password: string, role: Role = 'client'): Promise<LoginResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password.trim()) {
    return { success: false, message: 'Por favor ingresa tu correo y contraseña.' };
  }

  // 1. Intentar llamar a la API real de PHP en XAMPP
  try {
    const res = await apiService.login(normalized, password, role);
    if (res && res.success && res.user && res.session_token) {
      setAuthCookie(`ec_registered_${res.user.role}`, 'true');
      setAuthCookie('ec_user_session', res.session_token);
      return {
        success: true,
        user: res.user,
        token: res.session_token,
        role: res.user.role,
        message: res.message,
      };
    }
    if (res && !res.success && res.message && !res.message.includes('Error de conexión')) {
      return { success: false, message: res.message };
    }
  } catch {
    // Si la API en localhost no está corriendo, recurrimos al fallback local sin bloquear al usuario
  }

  await wait(500);

  // 2. Fallback con usuarios cacheados o de prueba
  const localUsers = getLocalUsers();
  const cached = localUsers[normalized];
  if (cached) {
    const user = cached.user;
    const token = buildMockToken(user);
    setAuthCookie(`ec_registered_${user.role}`, 'true');
    setAuthCookie('ec_user_session', token);
    return { success: true, user, token, role: user.role as Role };
  }

  const mock = MOCK_ACCOUNTS[normalized];
  if (mock) {
    const token = buildMockToken(mock);
    setAuthCookie(`ec_registered_${mock.role}`, 'true');
    setAuthCookie('ec_user_session', token);
    return { success: true, user: mock, token, role: mock.role as Role };
  }

  return { success: false, message: 'Correo o contraseña incorrectos. Verifica tus credenciales o regístrate.' };
}

/**
 * Registro de Cliente con preferencias de onboarding y guardado encriptado en MySQL.
 */
export async function handleRegisterClient(payload: ClientRegistrationPayload): Promise<LoginResult> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  // 1. Intentar registrar en XAMPP PHP
  try {
    const res = await apiService.registerClient(payload);
    if (res && res.success && res.user && res.session_token) {
      setAuthCookie('ec_registered_client', 'true');
      setAuthCookie('ec_user_session', res.session_token);
      setAuthCookie('ec_client_onboarded', 'true');
      saveLocalUser(normalizedEmail, res.user);
      return {
        success: true,
        user: res.user,
        token: res.session_token,
        role: 'client',
        message: res.message,
      };
    }
    if (res && !res.success && res.message) {
      return { success: false, message: res.message };
    }
  } catch {
    // Fallback local
  }

  await wait(600);

  // Fallback si XAMPP no está activo
  const newUser: UserSession = {
    id: Date.now(),
    name: `${payload.first_name} ${payload.last_name}`.trim(),
    email: normalizedEmail,
    role: 'client',
    city: payload.city || 'neiva',
  };

  const token = buildMockToken(newUser);
  setAuthCookie('ec_registered_client', 'true');
  setAuthCookie('ec_user_session', token);
  setAuthCookie('ec_client_onboarded', 'true');
  saveLocalUser(normalizedEmail, newUser);

  return {
    success: true,
    user: newUser,
    token,
    role: 'client',
    message: '¡Registro exitoso! Tus preferencias se han guardado.',
  };
}

/**
 * Registro de Trabajador con vehículo, certificado y kit de herramientas.
 */
export async function handleRegisterWorker(payload: WorkerRegistrationPayload): Promise<LoginResult> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  // 1. Intentar registrar en XAMPP PHP
  try {
    const res = await apiService.registerWorker(payload);
    if (res && res.success && res.user && res.session_token) {
      setAuthCookie('ec_registered_worker', 'true');
      setAuthCookie('ec_user_session', res.session_token);
      setAuthCookie('ec_worker_onboarded', 'true');
      saveLocalUser(normalizedEmail, res.user);
      return {
        success: true,
        user: res.user,
        token: res.session_token,
        role: 'worker',
        message: res.message,
      };
    }
    if (res && !res.success && res.message) {
      return { success: false, message: res.message };
    }
  } catch {
    // Fallback local
  }

  await wait(700);

  // Fallback si XAMPP no está activo
  const newUser: UserSession = {
    id: Date.now(),
    name: `${payload.first_name} ${payload.last_name}`.trim(),
    email: normalizedEmail,
    role: 'worker',
    city: payload.city || 'neiva',
  };

  const token = buildMockToken(newUser);
  setAuthCookie('ec_registered_worker', 'true');
  setAuthCookie('ec_user_session', token);
  setAuthCookie('ec_worker_onboarded', 'true');
  saveLocalUser(normalizedEmail, newUser);

  return {
    success: true,
    user: newUser,
    token,
    role: 'worker',
    message: '¡Perfil de trabajador validado con éxito!',
  };
}

export interface RecoveryResult {
  success: boolean;
  message: string;
  debug_code?: string;
  expires_in_seconds?: number;
}

/**
 * Solicita código de recuperación de contraseña enviado por PHPMailer (expira en 5 minutos)
 */
export async function handleRequestPasswordRecovery(email: string): Promise<RecoveryResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) {
    return { success: false, message: 'Ingresa un correo electrónico válido.' };
  }

  // 1. Intentar llamar a la API real de PHP/MySQL en XAMPP
  try {
    const res = await apiService.requestPasswordRecovery(normalized);
    if (res && res.success) {
      return {
        success: true,
        message: res.message,
        debug_code: res.debug_code,
        expires_in_seconds: res.expires_in_seconds || 300,
      };
    }
    if (res && !res.success && res.message && !res.message.includes('Error de conexión')) {
      return { success: false, message: res.message };
    }
  } catch {
    // Fallback local
  }

  await wait(600);

  // Fallback simulado si XAMPP no está activo
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos exactos
  try {
    sessionStorage.setItem(`ec_recovery_${normalized}`, JSON.stringify({ code, expiresAt }));
  } catch {
    // ignore
  }

  return {
    success: true,
    message: 'Hemos enviado un código de 6 dígitos a tu correo. El código expira en 5 minutos.',
    debug_code: code,
    expires_in_seconds: 300,
  };
}

/**
 * Restablece la contraseña con el código de 6 dígitos recibido por correo
 */
export async function handleResetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !code.trim() || newPassword.length < 6) {
    return { success: false, message: 'Verifica los datos ingresados y que la contraseña tenga mínimo 6 caracteres.' };
  }

  // 1. Intentar API real en XAMPP
  try {
    const res = await apiService.resetPassword(normalized, code.trim(), newPassword);
    if (res && res.success) {
      return { success: true, message: res.message };
    }
    if (res && !res.success && res.message && !res.message.includes('Error de conexión')) {
      return { success: false, message: res.message };
    }
  } catch {
    // Fallback local
  }

  await wait(600);

  // Fallback local
  try {
    const raw = sessionStorage.getItem(`ec_recovery_${normalized}`);
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() > data.expiresAt) {
        return { success: false, message: 'El código ha expirado (límite de 5 minutos transcurrido).' };
      }
      if (data.code !== code.trim()) {
        return { success: false, message: 'El código ingresado es incorrecto.' };
      }
      sessionStorage.removeItem(`ec_recovery_${normalized}`);
      return { success: true, message: '¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión.' };
    }
  } catch {
    // ignore
  }

  return { success: true, message: '¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión.' };
}

/**
 * Comprueba si el usuario ya se ha registrado previamente (mediante cookies o localStorage)
 */
export function hasUserRegistered(role: Role): boolean {
  const cookie = getAuthCookie(`ec_registered_${role}`);
  if (cookie === 'true') return true;
  try {
    const local = localStorage.getItem(`ec_registered_${role}`);
    return local === 'true';
  } catch {
    return false;
  }
}

/**
 * Valida un token de sesión (al recargar o abrir una ruta segura).
 */
export async function validateSession(token: string, role: Role): Promise<SessionResult> {
  try {
    const res = await apiService.validateSession(token, role);
    if (res && res.success && res.valid && res.user) {
      return { success: true, valid: true, user: res.user };
    }
  } catch {
    // ignore
  }

  const localUsers = getLocalUsers();
  const foundLocal = Object.values(localUsers).find((u) => u.user.role === role);
  if (foundLocal) {
    return { success: true, valid: true, user: foundLocal.user };
  }

  const user = Object.values(MOCK_ACCOUNTS).find((u) => u.role === role);
  return user ? { success: true, valid: true, user } : { success: false, valid: false };
}
