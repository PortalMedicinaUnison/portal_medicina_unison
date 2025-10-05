
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config';
import useUserUpdate from '../hooks/useUserUpdate'
import { cleanFormData } from "../../../utils/utils";
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  secondLastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  profile_photo: '',
  is_admin: false,
  is_super_admin: false,
};

function ProfileUpdate({ user, fetching, fetchError, relead, userId }) {
  const navigate = useNavigate();
  const { updateUser, loading: saving, error: saveError, success: saved, reset } = useUserUpdate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setValidationError('ID de usuario no proporcionado.');
      return;
    }

    const cleanedData = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.firstName) errors.push('El nombre es obligatorio.');
    if (!cleanedData.lastName) errors.push('El apellido paterno es obligatorio.');
    if (!cleanedData.email) errors.push('El correo electrónico es obligatorio.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      first_name: cleanedData.firstName,
      last_name: cleanedData.lastName,
      second_last_name: cleanedData.secondLastName,
      email: cleanedData.email,
      phone_number: cleanedData.phoneNumber,
      password: cleanedData.password,
      profile_photo: cleanedData.profile_photo,
      is_admin: cleanedData.is_admin,
      is_super_admin: cleanedData.is_super_admin,
    };
    
    await updateUser(userId, payload);
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
        profile_photo: user.profile_photo || '',
        is_admin: user.is_admin || false,
        is_super_admin: user.is_super_admin || false,
      });
    }
  }, [user]);

  useEffect(() => {
    if (saved) {
      navigate(ROUTES.USER.PROFILE);
    }
  }, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={relead}
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
        onRetry={relead}
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
            src={user?.profile_photo || "/default-avatar.png"} 
            alt="Foto de perfil" 
            className="user-profile-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />

          <div class="info-actions">
            <p className='item-link'>Cambiar foto</p>
            <p className='item-text'>Esto ayudará a tu administrador a identificarte</p>
          </div>
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
                  className="form-input--half"
                  disabled={saving}
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Correo Electrónico</dt>
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
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-input--half"
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