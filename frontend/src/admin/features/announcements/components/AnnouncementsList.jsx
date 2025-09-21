import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteAnnouncement from '../hooks/useDeleteAnnouncement';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function AnnouncementsList( { announcements, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteAnnouncement, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteAnnouncement();
  
  const [item, setItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const ANNOUNCEMENT_TYPES = {
    1: 'General',
    2: 'Internado'
  };

  const getAnnouncementTypeName = (typeEnum) => {
    return ANNOUNCEMENT_TYPES[typeEnum] || 'Desconocido';
  };

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return announcements.filter((announcement) => {
      if (typeFilter !== '' && announcement.announcement_type !== Number(typeFilter)) return false;
      if (statusFilter !== '' && announcement.is_visible !== (statusFilter === 'true')) return false;
      if (!searchQuery) return true;

      const title = String(announcement.title).toLowerCase();
      const description = String(announcement.description).toLowerCase();
      return title.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [announcements, searchQuery, statusFilter, typeFilter]);


// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_EDIT(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteAnnouncement(item);
    handleClose();
  };

  const handleClose = () => {
    setShowDialog(false);
    setItem(null);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      refetch();
      reset();
    }
  }, [deleted, refetch, reset]);

  useEffect(() => {
    if (deleteError) {
      alert(`Error al eliminar el aviso: ${deleteError}`);
      reset();
    }
  }, [deleteError, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar el anuncio"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!announcements) {
    return (
      <DataLoadError
        title="404"
        titleClassName="text-5xl"
        message="No se encontraron avisos."
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
          placeholder="Buscar por título o descripción"
        />
         <select
          className="btn-tertiary--light"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filtrar ambito"
        >
          <option value="">Ámbito</option>
          <option value="1">General</option>
          <option value="2">Internado</option>
        </select>
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Estatus</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12'>Título</th>
              <th className='w-4/12'>Descripción</th>
              <th className='w-2/12'>Ámbito</th>
              <th className='w-2/12'>Estatus</th>
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
                <td>{item.title}</td>
                <td className="text-left">{item.description}</td>
                <td>{getAnnouncementTypeName(item.announcement_type)}</td>
                <td>{item.is_visible ? 'Activo' : 'Inactivo'}</td>
                <td className="td-actions text-right">
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

      <Modal open={showDialog} onClose={handleClose}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este anuncio?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleClose}
          danger
        />
      </Modal>
      
    </div>
  );
}
    
export default AnnouncementsList;
