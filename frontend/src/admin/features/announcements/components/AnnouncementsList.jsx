import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function AnnouncementsList() {
  const navigate = useNavigate();
  const { announcements, loading: listLoading, error: listError, refetch } = useGetAnnouncements();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const getAnnouncementTypeName = (typeEnum) => {
    if (typeEnum === 1) return 'General';
    if (typeEnum === 2) return 'Pasantía';
  };

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return announcements.filter((announcement) => {
      if (typeFilter !== '') {
        const typeFilterNum = Number(typeFilter);
        if (announcement.announcement_type !== typeFilterNum)
          return false;
      }
      
      if (statusFilter !== '') {
        const isVisible = statusFilter === 'true';
        if (announcement.is_visible !== isVisible) 
          return false;
      }

      if (!searchQuery) return true;
      return (
        String(announcement.title).toLowerCase().includes(searchQuery) ||
        String(announcement.description).toLowerCase().includes(searchQuery)
      );
    });
  }, [announcements, searchQuery, statusFilter]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(id)));
  };
    
  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_EDIT(id)));
  };
    
  const handleDeleteButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DELETE(id)));
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por titulo o descripción"
        />
         <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar ambito"
        >
          <option value="">Ambito</option>
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
              <th colSpan={2}>Titulo</th>
              <th colSpan={3}>Descripción</th>
              <th>Ambito</th>
              <th>Estatus</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">No se encontraron avisos.</td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.announcement_id}>
                <td colSpan={2}>{item.title}</td>
                <td colSpan={3} className='text-left'>{item.description}</td>
                <td>{getAnnouncementTypeName(item.announcement_type)}</td>
                <td>{item.is_visible ? 'Activo' : 'Inactivo'}</td>
                <td className="td-actions text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.announcement_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.announcement_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.announcement_id), className: 'text-red-600' },
                    ]}
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
