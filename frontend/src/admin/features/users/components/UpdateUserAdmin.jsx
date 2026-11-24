import { useState, useEffect } from 'react';
import { useUser } from '../../../../contexts/UserContext';
import useUpdateUserAdmin from '../hooks/useUpdateUserAdmin';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { ROLE_LABELS } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';


// Cambia el rol de un usuario entre Estudiante y Administrador.
// Igual que el backend: solo un super administrador, nunca sobre sí mismo ni sobre otro super administrador.
function UpdateUserAdmin({ user, onSuccess }) {
  const { user: currentUser, isSuperAdmin } = useUser();
  const { updateUser, loading: saving, success: saved, error: saveError, reset } = useUpdateUserAdmin();

  const [showConfirm, setShowConfirm] = useState(false);

  const canChangeRole = Boolean(
    isSuperAdmin && user && user.role !== 'super_admin' && user.user_id !== currentUser?.user_id
  );
  const nextIsAdmin = user?.role !== 'admin';
  const nextRoleLabel = nextIsAdmin ? ROLE_LABELS.admin : ROLE_LABELS.student;

// ---------------------- HANDLERS ----------------------

  const handleOpenConfirm = () => setShowConfirm(true);

  const handleConfirm = async () => {
    if (!user) return;
    await updateUser(user.user_id, { is_admin: nextIsAdmin });
  };

  const handleClose = () => {
    if (saving) return;
    setShowConfirm(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setShowConfirm(false);
      reset();
      onSuccess?.();
    }
  }, [saved, reset, onSuccess]);

// ---------------------- RENDER ----------------------

  if (!canChangeRole) return null;

  return (
    <>
      <button
        type="button"
        className="btn-tertiary"
        onClick={handleOpenConfirm}
        disabled={saving}
      >
        {`Cambiar rol a ${nextRoleLabel}`}
      </button>

      <Modal open={showConfirm} onClose={handleClose}>
        {saveError ? (
          <ConfirmDialogContent
            title="No se pudo cambiar el rol"
            message={saveError}
            onConfirm={handleClose}
            primaryLabel="Aceptar"
          />
        ) : (
          <ConfirmDialogContent
            title="Confirmar cambio de rol"
            message={
              <p>
                El rol de <strong>{formatFullName(user)}</strong> cambiará a <strong>{nextRoleLabel}</strong>.
                {nextIsAdmin
                  ? ' Tendrá acceso al panel de administración.'
                  : ' Perderá el acceso al panel de administración.'}
                {' '}¿Deseas continuar?
              </p>
            }
            onConfirm={handleConfirm}
            primaryLabel={saving ? 'Guardando...' : 'Cambiar rol'}
            secondaryLabel="Cancelar"
            onCancel={handleClose}
          />
        )}
      </Modal>
    </>
  );
}

export default UpdateUserAdmin;
