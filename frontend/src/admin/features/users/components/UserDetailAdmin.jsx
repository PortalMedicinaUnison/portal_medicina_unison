import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import { useUser } from '../../../../contexts/UserContext';
import useDeleteUser from '../hooks/useDeleteUser';
import UpdateUserAdmin from './UpdateUserAdmin';
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

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // El backend no permite desactivar la propia cuenta ni, sin ser super administrador, a otros administradores.
  const canDeactivate = Boolean(
    user && user.user_id !== currentUser?.user_id && (isSuperAdmin || user.role === 'student')
  );

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
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      navigate(adminAbs(ROUTES.ADMIN.USER_LIST), { replace: true });
    }
  }, [deleted, navigate, reset]);

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
      <div className="item-container">
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
          message={deleteError || 'Ocurrió un problema al desactivar el usuario.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
        <UpdateUserAdmin user={user} onSuccess={refetch} />
        {canDeactivate && (
          <button
            type="button"
            className='btn-tertiary'
            onClick={handleDeleteButton}
            disabled={deleting}
          >
            {deleting ? 'Desactivando...' : 'Desactivar usuario'}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserDetailAdmin;
