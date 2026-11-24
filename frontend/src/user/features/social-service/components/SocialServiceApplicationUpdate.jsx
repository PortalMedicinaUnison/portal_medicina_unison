import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS_LABELS, PERIOD_LABELS, PROGRAMS, DOCUMENT_STAGES, labelOf } from '../../../../utils/constants';
import ExpedientePanel from '../../../../features/expediente/components/ExpedientePanel';
import useRespondSocialServiceApplication from '../hooks/useRespondSocialServiceApplication';
import NoSocialServiceApplication from './NoSocialServiceApplication';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


const INITIAL_FORM = {
  termsAccepted: false,
};

function SocialServiceApplicationUpdate({ application, fetching, fetchError, refetch, applicationId, user }) {
  const navigate = useNavigate();
  const { accept, decline, loading: saving, error: saveError, result, reset } = useRespondSocialServiceApplication();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);

// ---------------------- HANDLERS ----------------------

  const validateTerms = () => {
    if (!applicationId) {
      setValidationError('No se encontró tu asignación.');
      return false;
    }
    if (!formData.termsAccepted) {
      setValidationError('Debes confirmar que leíste y comprendiste la información.');
      return false;
    }
    return true;
  };

  // Se valida antes de abrir la confirmación para no pedir confirmar algo que no se enviará.
  const handleAcceptButton = (e) => {
    e.preventDefault();
    if (validateTerms()) setShowConfirmAccept(true);
  };

  const handleDeclineButton = (e) => {
    e.preventDefault();
    if (validateTerms()) setShowConfirmDecline(true);
  };

  const handleConfirmAccept = async () => {
    setShowConfirmAccept(false);
    await accept(applicationId);
  };

  const handleConfirmDecline = async () => {
    setShowConfirmDecline(false);
    await decline(applicationId);
  };

  const handleCloseConfirmAccept = () => setShowConfirmAccept(false);
  const handleCloseConfirmDecline = () => setShowConfirmDecline(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));

      if (validationError) setValidationError('');
      if (saveError) reset();
    },
    [validationError, saveError, reset]
  );

// ---------------------- EFFECTS ----------------------

  // La página de redirección decide a dónde ir según el nuevo estado (servicio social o declinada).
  useEffect(() => {
    if (result) navigate(ROUTES.USER.SOCIAL_SERVICE_REDIRECT, { replace: true });
  }, [result, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar tu asignación de servicio social"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!application) return <NoSocialServiceApplication onReload={refetch} />;

// ---------------------- RENDER ----------------------

  const { promotion } = application;
  const promotionLabel = promotion ? `${promotion.year} - ${labelOf(PERIOD_LABELS, promotion.period)}` : '—';
  const fullName = [user?.first_name, user?.last_name, user?.second_last_name].filter(Boolean).join(' ');

  return (
    <form className="component-container" onSubmit={handleAcceptButton}>
      <div className="item-container w-3/4 mb-8">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Promoción</dt>
            <dd className="item-text">{promotionLabel}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus de la asignación</dt>
            <dd className="item-text">{labelOf(APPLICATION_STATUS_LABELS, application.status)}</dd>
          </div>
        </dl>
      </div>

      <div className="w-full lg:w-3/4 mb-12">
        <h3 className="text-lg font-semibold text-gray-900">Documentos de inscripción</h3>
        <p className="mt-1 mb-4 text-sm text-gray-600">
          Sube tus documentos en PDF. La coordinación los revisa; tu plaza se registra cuando todos los obligatorios estén aprobados.
        </p>
        <ExpedientePanel
          program={PROGRAMS.SOCIAL_SERVICE}
          applicationId={application.application_id}
          stages={[DOCUMENT_STAGES.INSCRIPTION]}
          closed={Boolean(promotion?.is_finished)}
        />
      </div>

      <div className="w-3/4">
        <p className="mb-4">
          Yo, <b>{fullName}</b>, como estudiante de la carrera de Medicina que acreditó el Internado Médico de
          Pregrado y fue seleccionado(a) para realizar el Servicio Social en la promoción <b>{promotionLabel}</b>,
          declaro que he sido informado(a) sobre las condiciones, requisitos y obligaciones que implica la
          realización del Servicio Social como parte de mi formación profesional.
        </p>

        <p className="mb-4">
          Entiendo que el Servicio Social es una etapa obligatoria para concluir mi formación, que <b>tiene una
          duración de un año</b> y que se llevará a cabo en la plaza de la unidad de salud que me asigne la
          coordinación del programa.
        </p>

        <h3 className="text-md font-bold">Compromisos y Responsabilidades</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Presentarme en la plaza asignada y cumplir con el horario establecido por la unidad de salud</li>
          <li>Mantener una conducta ética y profesional en todo momento</li>
          <li>Respetar las normas y reglamentos internos de la unidad de salud</li>
          <li>Entregar en tiempo y forma los informes y documentos que solicite la coordinación</li>
          <li>Reportar cualquier incidencia o situación irregular a las autoridades correspondientes</li>
        </ul>

        <p>
          Declaro que he leído, comprendido y acepto las condiciones mencionadas. Asimismo, <b>comprendo que
          mi decisión de aceptar o declinar la participación en el Servicio Social para esta promoción
          es definitiva</b> y tendrá las implicaciones académicas correspondientes según el reglamento de la facultad.
        </p>
      </div>

      <div className="flex items-center mt-12 gap-4">
        <input
          id="termsAccepted"
          name="termsAccepted"
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={handleChange}
          disabled={saving}
        />
        <label htmlFor="termsAccepted">
          He leído y comprendido toda la información presentada
        </label>
      </div>

      {/* Junto a los botones para que el error se vea donde el estudiante hizo clic. */}
      {(validationError || saveError) && (
        <div className="alert-error mt-8 w-3/4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {validationError || saveError}
          </span>
        </div>
      )}

      {/* Modal Aceptar */}
      <Modal open={showConfirmAccept} onClose={handleCloseConfirmAccept}>
        <ConfirmDialogContent
          title="Confirmar aceptación"
          message="Al confirmar, aceptas realizar el Servicio Social en esta promoción. Esta acción no se puede deshacer. ¿Estás seguro?"
          onConfirm={handleConfirmAccept}
          primaryLabel="Confirmar aceptación"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirmAccept}
        />
      </Modal>

      {/* Modal Declinar */}
      <Modal open={showConfirmDecline} onClose={handleCloseConfirmDecline}>
        <ConfirmDialogContent
          title="Confirmar declinación"
          message="Al confirmar, declinas tu participación en el Servicio Social de esta promoción. Esta acción es definitiva y tendrá implicaciones académicas. ¿Estás seguro?"
          onConfirm={handleConfirmDecline}
          primaryLabel="Confirmar declinación"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirmDecline}
          danger
        />
      </Modal>

      <div className="button-group">
        <button
          type="button"
          className="btn-secondary hover:bg-red-600 hover:text-white"
          onClick={handleDeclineButton}
          disabled={saving}
        >
          Declinar mi participación
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Aceptar mi participación'}
        </button>
      </div>
    </form>
  );
}

export default SocialServiceApplicationUpdate;
