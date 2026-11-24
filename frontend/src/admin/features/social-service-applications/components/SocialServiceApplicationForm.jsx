import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateSocialServiceApplication from '../hooks/useCreateSocialServiceApplication';
import useGetPromotions from '../../promotions/hooks/useGetPromotions';
import useGetUsers from '../../users/hooks/useGetUsers';
import { cleanFormData, formatFullName } from '../../../../utils/utils';
import { PERIOD_LABELS, PROGRAMS, labelOf } from '../../../../utils/constants';


const INITIAL_FORM = {
  promotionId: '',
  academicId: '',
};

function SocialServiceApplicationForm() {
  const navigate = useNavigate();
  const { createApplication, loading: saving, success: saved, error: saveError, reset } = useCreateSocialServiceApplication();
  const { promotions, loading: fetchingPromotions, error: promotionsError } = useGetPromotions({ program: PROGRAMS.SOCIAL_SERVICE });
  const { users, loading: fetchingUsers, error: usersError } = useGetUsers();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdId, setCreatedId] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Solo promociones de servicio social que no han finalizado (el backend rechaza las demás).
  const openPromotions = useMemo(
    () => (promotions ?? []).filter(
      (promotion) => Number(promotion.program) === PROGRAMS.SOCIAL_SERVICE && !promotion.is_finished
    ),
    [promotions]
  );

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

  // Lookup del usuario cuando hay 9 dígitos
  const matchedUser = useMemo(() => {
    const academic_id = formData.academicId?.trim();
    if (!academic_id || !/^\d{9}$/.test(academic_id)) return null;
    if (fetchingUsers || usersError || !Array.isArray(users)) return null;
    return users.find(user => String(user.academic_id) === academic_id) || null;
  }, [formData.academicId, users, fetchingUsers, usersError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData({
      promotionId: Number(formData.promotionId),
      academicId: formData.academicId,
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.promotionId) errors.push('La promoción es obligatoria.');
    if (!cleanedData.academicId) errors.push('El expediente del alumno es obligatorio.');
    if (cleanedData.academicId && !/^\d{9}$/.test(cleanedData.academicId)) {
      errors.push('El expediente del alumno debe tener 9 dígitos numéricos.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      promotion_id: cleanedData.promotionId,
      academic_id: cleanedData.academicId,
    };

    // Si el alumno no ha acreditado el internado, el backend responde 409 y su mensaje se muestra arriba.
    const response = await createApplication(payload);
    if (response && response.data.application_id) {
      setCreatedId(response.data.application_id);
    }
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setFormData(INITIAL_FORM);

      const alertTimeout = setTimeout(() => {
        reset();
      }, 10000);
      return () => clearTimeout(alertTimeout);
    }
  }, [saved, reset]);

// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          La asignación se registró exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_DETAIL(createdId))}
              className="font-bold underline"
            >
              Ver
            </Link>
          )}
        </div>
      )}

      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div className="info-container">
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Promoción *</dt>
              <dd className="item-text">
                <select
                  name="promotionId"
                  value={formData.promotionId}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving || fetchingPromotions || Boolean(promotionsError)}
                  required
                >
                  <option value="">{fetchingPromotions ? 'Cargando promociones...' : 'Selecciona una promoción'}</option>
                  {openPromotions.map(promotion => (
                    <option key={promotion.promotion_id} value={promotion.promotion_id}>
                      {promotion.year} - {labelOf(PERIOD_LABELS, promotion.period)}
                    </option>
                  ))}
                </select>
                {promotionsError && (
                  <p className="text-sm text-red-600 mt-1">{promotionsError}</p>
                )}
                {!fetchingPromotions && !promotionsError && openPromotions.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No hay promociones de servicio social abiertas para asignar.</p>
                )}
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Expediente del alumno *</dt>
              <dd className="item-text">
                <input
                  name="academicId"
                  type="text"
                  value={formData.academicId}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="222222222"
                  maxLength={9}
                  disabled={saving}
                  required
                />
                {matchedUser && (
                  <p className="text-sm text-green-600 mt-1">
                    Usuario encontrado: {formatFullName(matchedUser)}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  El alumno debe tener el internado acreditado (finalizado) y no tener otro servicio social en curso.
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_LIST))}
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

export default SocialServiceApplicationForm;
