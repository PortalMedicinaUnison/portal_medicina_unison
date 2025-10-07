import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import useUpdateApplication from '../../applications/hooks/useUpdateApplication'
import useCreateInternship from '../../internships/hooks/useCreateInternship';
import { cleanFormData } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


const INITIAL_FORM = {
  status: 1,
  termsAccepted: false,
};

function ApplicationUpdate({ application, fetching, fetchError, refetch, applicationId, user }) {
  const navigate = useNavigate();
  const { updateApplication, loading: saving, error: saveError, success: saved, reset } = useUpdateApplication();
  const { createInternship, loading: creatingInternship, error: internshipError, success: internshipCreated, reset: resetCreate } = useCreateInternship();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);

// ---------------------- HANDLERS ----------------------
  const handleAcceptButton = (e) => {
    e.preventDefault();
    setShowConfirmAccept(true);
  };

  const handleDeclineButton = (e) => {
    e.preventDefault();
    setShowConfirmDecline(true);
  };

  const handleConfirmAccept = async () => {
    setShowConfirmAccept(false);

    if (!applicationId) {
      setValidationError("ID de la aplicación al internado no proporcionado.");
      return;
    }

    const cleanedData = cleanFormData(formData);

    const errors = [];
    if (!cleanedData.termsAccepted) errors.push("Debe aceptar los términos y condiciones.");
    if (errors.length > 0) {
      setValidationError(errors.join(" | "));
      return;
    }

    const payload = {
      status: 2,
    };
    
    const response = await updateApplication(applicationId, payload);
    console.log("Update response:", response);

    if (response && response.data) {
      const internshipPayload = {
        application_id: applicationId,
        site_id: null,
        status: 1,
      };

      console.log("Creating internship with payload:", internshipPayload);

      await createInternship(internshipPayload);
    }
  };

  const handleConfirmDecline = async () => {
    setShowConfirmDecline(false);

    if (!applicationId) {
      setValidationError("ID de la aplicación al internado no proporcionado.");
      return;
    }

    const cleanedData = cleanFormData(formData);

    const errors = [];
    if (!cleanedData.termsAccepted) errors.push("Debe aceptar los términos y condiciones.");
    if (errors.length > 0) {
      setValidationError(errors.join(" | "));
      return;
    }

    const payload = {
      status: 3,
    };

    await updateApplication(applicationId, payload);
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
      if (internshipError) resetCreate();

    },
    [validationError, saveError, internshipError, reset, resetCreate]
  );

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved && internshipCreated) {
      navigate(ROUTES.USER.INTERNSHIP_REDIRECT);
    } else if (saved && !creatingInternship && internshipError) {
      setValidationError("La aplicación se guardó pero hubo un error al crear el internship. Contacta al administrador.");
    }
  }, [saved, internshipCreated, creatingInternship, internshipError, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar el aplicación al internado"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!application) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información sobre tu internado. Contacta a tu administrador para verificar tu estado."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
    
// ---------------------- RENDER ----------------------

return (
    <form className="component-container" onSubmit={handleAcceptButton}>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError || internshipError}
            </span>
        </div>
      )}

      <div className="w-3/4">
        <p className="mb-4">
        Yo,{" "}
          <b>
            {user?.first_name} {user?.last_name} {user?.second_last_name}
          </b>{" "}
          como estudiante de la carrera de Medicina seleccionado para hacer mi Internado Médico de Pregrado en el año
          académico{" "}
          <b>
            {application.promotion.year} - {application.promotion.period}
          </b>
          , declaro que he sido informado(a) sobre las condiciones, requisitos y obligaciones que implica la realización del
          Internado Médico de Pregrado como parte de mi formación académica.
        </p>
        
        <p className="mb-4">
          Entiendo que el Internado Médico es una etapa obligatoria y fundamental en mi formación profesional, 
          que <b>tiene una duración de un año académico</b> y que se llevará a cabo en las instituciones de salud 
          asignadas por la coordinación del programa.
        </p>
        
        <h2 className="text-md font-bold">Compromisos y Responsabilidades</h2>
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
          name="termsAccepted"
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={handleChange}
          disabled={saving}
        />
        <label>
          He leído y comprendido toda la información presentada
        </label>
      </div>

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