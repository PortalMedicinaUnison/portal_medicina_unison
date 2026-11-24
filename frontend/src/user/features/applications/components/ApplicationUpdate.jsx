import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS_LABELS, PERIOD_LABELS, labelOf } from '../../../../utils/constants';
import useRespondApplication from '../hooks/useRespondApplication';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


const INITIAL_FORM = {
  termsAccepted: false,
};

function ApplicationUpdate({ application, fetching, fetchError, refetch, applicationId, user }) {
  const navigate = useNavigate();
  const { accept, decline, loading: saving, error: saveError, result, reset } = useRespondApplication();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);

// ---------------------- HANDLERS ----------------------

  const validateTerms = () => {
    if (!applicationId) {
      setValidationError("No se encontró tu asignación.");
      return false;
    }
    if (!formData.termsAccepted) {
      setValidationError("Debes aceptar los términos y condiciones.");
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
        [name]: type === "checkbox" ? checked : value,
      }));

      if (validationError) setValidationError("");
      if (saveError) reset();
    },
    [validationError, saveError, reset]
  );

// ---------------------- EFFECTS ----------------------

  // La página de redirección decide a dónde ir según el nuevo estado (internado o declinada).
  useEffect(() => {
    if (result) navigate(ROUTES.USER.INTERNSHIP_REDIRECT, { replace: true });
  }, [result, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar tu asignación al internado"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!application) {
    return (
      <DataLoadError
        title="Aún no tienes una asignación"
        message="No encontramos una asignación al internado a tu nombre. Contacta a la coordinación para verificar tu estado."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const { promotion } = application;
  const promotionLabel = `${promotion.year} - ${labelOf(PERIOD_LABELS, promotion.period)}`;
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

      <div className="w-3/4">
        <p className="mb-4">
          Yo, <b>{fullName}</b>, como estudiante de la carrera de Medicina seleccionado(a) para hacer mi Internado
          Médico de Pregrado en la promoción <b>{promotionLabel}</b>, declaro que he sido informado(a) sobre las
          condiciones, requisitos y obligaciones que implica la realización del Internado Médico de Pregrado como
          parte de mi formación académica.
        </p>

        <p className="mb-4">
          Entiendo que el Internado Médico es una etapa obligatoria y fundamental en mi formación profesional,
          que <b>tiene una duración de un año académico</b> y que se llevará a cabo en las instituciones de salud
          asignadas por la coordinación del programa.
        </p>

        <h3 className="text-md font-bold">Compromisos y Responsabilidades</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Cumplir con el horario y las guardias establecidas por la institución de salud asignada</li>
          <li>Mantener una conducta ética y profesional en todo momento</li>
          <li>Respetar las normas y reglamentos internos de la institución de salud</li>
          <li>Participar activamente en las actividades académicas y clínicas programadas</li>
          <li>Reportar cualquier incidencia o situación irregular a las autoridades correspondientes</li>
        </ul>

        <p>
          Declaro que he leído, comprendido y acepto las condiciones mencionadas. Asimismo, <b>comprendo que
          mi decisión de aceptar o declinar la participación en el Internado Médico para este año académico
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
          message="Al confirmar, aceptas participar en el Internado Médico. Esta acción no se puede deshacer. ¿Estás seguro?"
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
          message="Al confirmar, declinas tu participación en el Internado Médico. Esta acción es definitiva y tendrá implicaciones académicas. ¿Estás seguro?"
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

export default ApplicationUpdate;
