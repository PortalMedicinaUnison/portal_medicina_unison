import { SONORA_MUNICIPALITIES } from '../utils/constants';

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validateEmail(email) {
  if (!isValidEmail(email)) {
      return { valid: false, error: 'El correo electrónico no tiene un formato válido.' };
  }
  return { valid: true };
}

// Expediente: 9 dígitos que empiezan con 2 (igual que el backend).
export function isValidAcademicId(academicId) {
  return /^2\d{8}$/.test(academicId);
}

export function validateAcademicId(academicId) {
  if (!isValidAcademicId(academicId)) {
    return { valid: false, error: 'El expediente debe tener 9 dígitos y empezar con 2.' };
  }
  return { valid: true };
}

// Mismas reglas que el backend (utils/validation.py): 8+ caracteres, una mayúscula y un número.
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (new TextEncoder().encode(password).length > 72) {
    return { valid: false, error: 'La contraseña es demasiado larga (máximo 72 caracteres).' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos una letra mayúscula.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos un número.' };
  }
  return { valid: true };
}

export const isValidCity = (city) => {
  return SONORA_MUNICIPALITIES.includes(city);
};