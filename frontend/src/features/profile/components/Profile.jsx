import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import useDeleteUser from '../hooks/useDeleteUser';
import useInternshipByAcademic from '../../../user/features/internships/hooks/useInternshipByAcademic';
import { INTERNSHIP_STATUS_LABELS, ROLE_LABELS, labelOf } from '../../../utils/constants';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../utils/ui/DataLoadError';
import Modal from '../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../utils/ui/ConfirmDialogContent';
import ChangePasswordForm from './ChangePasswordForm';
import UserAvatar from '../../../components/UserAvatar';


// Perfil de la cuenta en sesión. También lo abren administradores (sin expediente ni internado).
function Profile({ user, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { deleteUser, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteUser();

  // Solo los estudiantes tienen internado; para un administrador no se consulta.
  const isStudent = user?.role === 'student';
  const {
    internship,
    loading: fetchingInternship,
    error: internshipError,
  } = useInternshipByAcademic(isStudent ? user.academic_id : null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleOpenPasswordForm = () => setShowPasswordForm(true);
  const handleClosePasswordForm = () => setShowPasswordForm(false);

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    await deleteUser();
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  // La cuenta desactivada ya no puede usar la sesión: se cierra y se va al login.
  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      logout();
    }
  }, [deleted, reset, logout]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

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
        message="No encontramos información de este usuario."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const fullName = [user.first_name, user.last_name, user.second_last_name].filter(Boolean).join(' ');

  const getInternshipText = () => {
    if (fetchingInternship) return 'Cargando...';
    if (internshipError) return 'No se pudo consultar el internado.';
    if (!internship) return 'Sin internado asignado';
    const status = labelOf(INTERNSHIP_STATUS_LABELS, internship.status);
    return internship.site?.name ? `${status} · ${internship.site.name}` : status;
  };

  return (
    <div className="info-container">
      <div className="user-info-photo">
        <UserAvatar user={user} className="user-profile-photo" />
      </div>

      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Nombre completo</dt>
            <dd className="item-text">{fullName}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Rol</dt>
            <dd className="item-text">
              {labelOf(ROLE_LABELS, user.role, user.is_admin ? 'Administrador' : 'Estudiante')}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Expediente</dt>
            <dd className="item-text">{user.academic_id || '—'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Correo electrónico</dt>
            <dd className="item-text">{user.email}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Teléfono</dt>
            <dd className="item-text">{user.phone_number || '—'}</dd>
          </div>
          {isStudent && (
            <div className="item-row">
              <dt className="item-header">Internado</dt>
              <dd className="item-text">{getInternshipText()}</dd>
            </div>
          )}
        </dl>
      </div>

      <Modal open={showPasswordForm} title="Cambiar contraseña" onClose={handleClosePasswordForm}>
        <ChangePasswordForm onClose={handleClosePasswordForm} />
      </Modal>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Desactivar mi cuenta"
          message="Se cerrará tu sesión y ya no podrás iniciar sesión con esta cuenta. ¿Deseas continuar?"
          onConfirm={handleConfirmDelete}
          primaryLabel={deleting ? 'Desactivando...' : 'Desactivar'}
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message={deleteError || 'Ocurrió un problema al desactivar tu cuenta.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
        <button
          type="button"
          className='btn-tertiary'
          onClick={handleOpenPasswordForm}
        >
          Cambiar contraseña
        </button>
        {/* El backend no permite que un super administrador desactive su propia cuenta. */}
        {!user.is_super_admin && (
          <button
            type="button"
            className='btn-tertiary'
            onClick={handleDeleteButton}
            disabled={deleting}
          >
            {deleting ? 'Desactivando...' : 'Desactivar mi cuenta'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
