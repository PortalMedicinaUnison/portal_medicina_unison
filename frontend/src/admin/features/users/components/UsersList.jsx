import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteUser from '../hooks/useDeleteUser';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function UserList({ users, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteUser, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteUser();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  
  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return users.filter((item) => {
      if (!searchQuery) return true;

      const academicId = String(item.academic_id).toLowerCase()
      const firstName = String(item.first_name).toLowerCase()
      const lastName = String(item.last_name).toLowerCase()
      const secondLastName = String(item.second_last_name).toLowerCase()
      return (
        academicId.includes(searchQuery) ||
        firstName.includes(searchQuery) ||
        lastName.includes(searchQuery) ||
        secondLastName.includes(searchQuery)
      );      
    });
  }, [users, searchQuery]);

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
  
  if (!users) {
    return (
      <DataLoadError
        title="404"
        titleClassName="text-5xl"
        message="No se encontraron usuarios."
        onRetry={refetch}
        retryLabel='Recargar'
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
              <th className='w-2/12'>Internado</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                {search || statusFilter || typeFilter 
                  ? 'No se encontraron avisos que coincidan con los filtros.' 
                  : 'No hay avisos disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.announcement_id}>
                <td className="text-left">{item.first_name}</td>
                <td className="text-left">{item.academic_id}</td>
                <td className="text-left">{item.email}</td>
                <td>{item.internship_id ? 'Inscrito' : 'No inscrito'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.announcement_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.announcement_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.announcement_id), className: 'text-red-600' },
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
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message="Ocurrió un problema al eliminar el anuncio"
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default UserList;
