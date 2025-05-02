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

export function isValidAcademicId(academicId) {
  const regex = /^\d{9}$/;
  return regex.test(academicId);
}

export function validateAcademicId(academicId) {
  if (!isValidAcademicId(academicId)) {
    return { valid: false, error: 'El expediente debe ser un número de exactamente 9 dígitos.' };
  }
  return { valid: true };
}

export function validatePassword(password) {
  const minLength = /^.{8,}$/;
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (!minLength.test(password)) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (!hasUppercase.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos una letra mayúscula.' };
  }
  if (!hasLowercase.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos una letra minúscula.' };
  }
  if (!hasNumber.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos un número.' };
  }
  if (!hasSpecialChar.test(password)) {
    return { valid: false, error: 'La contraseña debe incluir al menos un símbolo especial.' };
  }
  return { valid: true };
};

