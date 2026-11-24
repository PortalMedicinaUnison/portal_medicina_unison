import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import { useUser } from '../../../../contexts/UserContext';
import useDeleteUser from '../hooks/useDeleteUser';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { ROLE_LABELS, labelOf } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';


function UserList({ users, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { user: currentUser, isSuperAdmin } = useUser();
  const { deleteUser, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteUser();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((item) => {
      if (!searchQuery) return true;

      const academicId = String(item.academic_id ?? '').toLowerCase();
      const fullName = formatFullName(item).toLowerCase();
      return academicId.includes(searchQuery) || fullName.includes(searchQuery);
    });
  }, [users, searchQuery]);

  // El backend no permite desactivar la propia cuenta ni, sin ser super administrador, a otros administradores.
  const canDeactivate = (target) =>
    target.user_id !== currentUser?.user_id && (isSuperAdmin || target.role === 'student');

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.USER_DETAIL(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteUser(item);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  }

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      setItem(null);
      refetch();
      reset();
    }
  }, [deleted, refetch, reset]);

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
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------
  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o expediente"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-4/12'>Nombre</th>
              <th className='w-2/12'>Expediente</th>
              <th className='w-3/12'>Correo</th>
              <th className='w-2/12'>Rol</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  {search
                  ? 'No se encontraron usuarios que coincidan con la búsqueda.'
                  : 'No hay usuarios registrados.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.user_id}>
                <td className="text-left">{formatFullName(item)}</td>
                <td>{item.academic_id || '—'}</td>
                <td>{item.email}</td>
                <td>{labelOf(ROLE_LABELS, item.role)}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.user_id) },
                      {
                        label: 'Desactivar',
                        onClick: () => handleDeleteButton(item.user_id),
                        className: 'text-red-600',
                        disabled: !canDeactivate(item),
                      },
                    ]}
                    disabled={deleting}
                  />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
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

    </div>
  );
}

export default UserList;
