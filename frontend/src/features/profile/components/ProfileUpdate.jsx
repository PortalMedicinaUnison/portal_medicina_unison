import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config';
import { useUser } from '../../../contexts/UserContext';
import useUserUpdate from '../hooks/useUserUpdate';
import { cleanFormData } from "../../../utils/utils";
import { validateEmail } from '../../../utils/validations';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../utils/ui/DataLoadError';


// Límite de los nombres en el backend (schemas/user.py).
const NAME_MAX_LENGTH = 50;

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  secondLastName: '',
  email: '',
  phoneNumber: '',
};

function ProfileUpdate({ user, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { reload } = useUser();
  const { updateUser, loading: saving, error: saveError, reset } = useUserUpdate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (validationError) setValidationError('');
    if (saveError) reset();
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.firstName) errors.push('El nombre es obligatorio.');
    if (!cleanedData.lastName) errors.push('El apellido paterno es obligatorio.');
    if (!cleanedData.email) errors.push('El correo electrónico es obligatorio.');
    else {
      const emailCheck = validateEmail(cleanedData.email);
      if (!emailCheck.valid) errors.push(emailCheck.error);
    }
    if (cleanedData.phoneNumber && !/^\d{10}$/.test(cleanedData.phoneNumber)) {
      errors.push('El teléfono debe tener 10 dígitos.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      first_name: cleanedData.firstName,
      last_name: cleanedData.lastName,
      second_last_name: cleanedData.secondLastName || null,
      email: cleanedData.email,
      phone_number: cleanedData.phoneNumber || null,
    };

    const saved = await updateUser(payload);
    if (!saved) return;

    // El contexto guarda los datos de la sesión (perfil, barra superior): se vuelven a pedir.
    await reload();
    navigate(ROUTES.USER.PROFILE);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        secondLastName: user.second_last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
      });
    }
  }, [user]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!user) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

return (
    <form className="component-container" onSubmit={handleSubmit}>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div className="info-container">
        <div className="user-info-photo">
          <img
            src={user.profile_photo || "/default-avatar.png"}
            alt="Foto de perfil"
            className="user-profile-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        </div>

        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Nombre *</dt>
              <dd className="item-text">
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  maxLength={NAME_MAX_LENGTH}
                  className="form-input--half"
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Apellido Paterno *</dt>
              <dd className="item-text">
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  maxLength={NAME_MAX_LENGTH}
                  className="form-input--half"
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Apellido Materno</dt>
              <dd className="item-text">
                <input
                  name="secondLastName"
                  type="text"
                  value={formData.secondLastName}
                  onChange={handleChange}
                  maxLength={NAME_MAX_LENGTH}
                  className="form-input--half"
                  disabled={saving}
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Correo Electrónico *</dt>
              <dd className="item-text">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Teléfono</dt>
              <dd className="item-text">
                <input
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  className="form-input--half"
                  placeholder="10 dígitos"
                  disabled={saving}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(ROUTES.USER.PROFILE)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProfileUpdate;
