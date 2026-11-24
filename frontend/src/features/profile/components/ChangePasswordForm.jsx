import { useState, useCallback } from 'react';
import useChangePassword from '../hooks/useChangePassword';
import { validatePassword } from '../../../utils/validations';


const INITIAL_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

// Formulario para cambiar la contraseña de la cuenta en sesión (se muestra dentro de un <Modal>).
function ChangePasswordForm({ onClose }) {
  const { changePassword, loading: saving, error: saveError, success: saved, reset } = useChangePassword();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationError) setValidationError('');
    if (saveError) reset();
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Las contraseñas no se recortan: los espacios forman parte de ellas.
    const { currentPassword, newPassword, confirmPassword } = formData;

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!currentPassword) errors.push('La contraseña actual es obligatoria.');
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) errors.push(passwordCheck.error);
    if (newPassword !== confirmPassword) errors.push('Las contraseñas no coinciden.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const changed = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    if (changed) setFormData(INITIAL_FORM);
  };

// ---------------------- RENDER ----------------------

  if (saved) {
    return (
      <div className="space-y-6">
        <div className="alert-success">
          Tu contraseña se actualizó correctamente.
        </div>
        <div className="flex justify-end">
          <button type="button" className="btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="form-input_full"
          disabled={saving}
          required
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={formData.newPassword}
          onChange={handleChange}
          className="form-input_full"
          disabled={saving}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Al menos 8 caracteres, una letra mayúscula y un número.
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input_full"
          disabled={saving}
          required
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
