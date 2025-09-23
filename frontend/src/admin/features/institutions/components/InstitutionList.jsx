import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteInstitution from '../hooks/useDeleteInstitution';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function InstitutionList({ institutions, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteInstitution, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteInstitution();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return institutions.filter((institution) => {
      if (!searchQuery) return true;

      const name = String(institution.title).toLowerCase();
      return name.includes(searchQuery);
    });
  }, [institutions, searchQuery]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_EDIT(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteInstitution(item);
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
        title="No se pudo cargar la institución"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!institutions) {
    return (
      <DataLoadError
        title="404"
        titleClassName="text-5xl"
        message="No se encontraron instituciones."
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
          placeholder="Buscar por razon social"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-6/12'>Razon social</th>
              <th className='w-5/12'></th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                {search
                  ? 'No se encontraron instituciones que coincidan con los filtros.' 
                  : 'No hay instituciones disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.institution_id}>
                <td className="text-left">{item.title}</td>
                <td></td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.institution_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.institution_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.institution_id), className: 'text-red-600' },
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
          message="Ocurrió un problema al eliminar la institución."
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default InstitutionList;
