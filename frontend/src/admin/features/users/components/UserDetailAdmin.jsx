import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/UserContext';
import useDeleteUser from '../hooks/useDeleteUser';
import useReactivateUser from '../hooks/useReactivateUser';
import UserAvatar from '../../../../components/UserAvatar';
import UpdateUserAdmin from './UpdateUserAdmin';
import PasswordResetLinkDialog from './PasswordResetLinkDialog';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { ROLE_LABELS, labelOf } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';


function UserDetailAdmin({ user, fetching, fetchError, refetch, userId }) {
  const navigate = useNavigate();
  const { user: currentUser, isSuperAdmin } = useUser();
  const { deleteUser, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteUser();
  const { reactivateUser, loading: reactivating, success: reactivated, error: reactivateError, reset: resetReactivate } = useReactivateUser();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // El backend no permite desactivar la propia cuenta ni, sin ser super administrador, a otros administradores.
  const hasPermission = Boolean(
    user && user.user_id !== currentUser?.user_id && (isSuperAdmin || user.role === 'student')
  );
  const canDeactivate = hasPermission && user?.is_active;
  // Mismas reglas en el backend; la propia contraseña se cambia desde el perfil.
  const canResetPassword = hasPermission && user?.is_active;
  const canReactivate = hasPermission && user && !user.is_active;

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!userId) return;
    await deleteUser(userId);
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
    resetReactivate();
  };

  const handleReactivate = () => {
    if (userId) reactivateUser(userId);
  };

// ---------------------- EFFECTS ----------------------

  // Tras desactivar se queda en la ficha (con "Reactivar cuenta" a la mano para deshacerlo): en la
  // lista, que muestra solo cuentas activas, la cuenta parecería haber desaparecido.
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      setNotice('Cuenta desactivada: ya no puede iniciar sesión. Puedes deshacerlo con "Reactivar cuenta".');
      refetch?.();
    }
  }, [deleted, refetch, reset]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

  useEffect(() => {
    if (reactivated) {
      resetReactivate();
      setNotice('Cuenta reactivada: ya puede volver a iniciar sesión.');
      refetch?.();
    }
  }, [reactivated, refetch, resetReactivate]);

  useEffect(() => {
    if (reactivateError) setShowErrorDialog(true);
  }, [reactivateError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
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
        message="No encontramos información para este usuario."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  return (
    <div className="info-container">
      {notice && <div className="alert-success mb-6" role="status">{notice}</div>}
      <div className="item-container">
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar user={user} className="size-20 rounded-full ring-1 ring-gray-200" />
          {!user.is_active && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">Cuenta desactivada</span>
          )}
        </div>
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Nombre completo</dt>
            <dd className="item-text">{formatFullName(user)}</dd>
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
            <dt className="item-header">Rol</dt>
            <dd className="item-text">{labelOf(ROLE_LABELS, user.role)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Aviso de privacidad</dt>
            <dd className="item-text">
              {user.privacy_notice_accepted ? 'Aceptado (versión vigente)' : 'Pendiente de aceptar'}
            </dd>
          </div>
        </dl>
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar desactivación"
          message="El usuario ya no podrá iniciar sesión en el portal. ¿Deseas desactivarlo?"
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
          message={deleteError || reactivateError || 'Ocurrió un problema al actualizar el usuario.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
        {user.is_active && <UpdateUserAdmin user={user} onSuccess={refetch} />}
        {canResetPassword && <PasswordResetLinkDialog user={user} />}
        {canReactivate && (
          <button
            type="button"
            className="btn-primary"
            onClick={handleReactivate}
            disabled={reactivating}
          >
            {reactivating ? 'Reactivando...' : 'Reactivar cuenta'}
          </button>
        )}
        {canDeactivate && (
          <button
            type="button"
            className='btn-tertiary text-red-600'
            onClick={handleDeleteButton}
            disabled={deleting}
          >
            {deleting ? 'Desactivando...' : 'Desactivar cuenta'}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserDetailAdmin;
