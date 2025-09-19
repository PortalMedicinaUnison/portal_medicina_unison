import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import useDeleteAnnouncement from '../hooks/useDeleteAnnouncement';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function AnnouncementsList() {
  const navigate = useNavigate();
  const { announcements, loading: fetching, error: fetchError, refetch } = useGetAnnouncements();
  const { deleteAnnouncement, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteAnnouncement();


// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const ANNOUNCEMENT_TYPES = {
    1: 'General',
    2: 'Pasantía'
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
    const userConfirmation = window.confirm('Este aviso se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    deleteAnnouncement(id);
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

  if (fetching || deleting) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
      alert(`Error al cargar los avisos: ${fetchError}. Favor de recargar la página para intentar de nuevo.`);
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
              <th colSpan={3}>Título</th>
              <th colSpan={4}>Descripción</th>
              <th>Ámbito</th>
              <th>Estatus</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10">
                  {search || statusFilter || typeFilter 
                    ? 'No se encontraron avisos que coincidan con los filtros.' 
                    : 'No hay avisos disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.announcement_id}>
                <td colSpan={3}>{item.title}</td>
                <td colSpan={4} className="text-left">{item.description}</td>
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
    </div>
  );
}
    
export default AnnouncementsList;
