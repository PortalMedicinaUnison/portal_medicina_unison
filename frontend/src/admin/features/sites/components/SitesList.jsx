import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';
import useGetSites from '../hooks/useGetSites';
import useDeleteSite from '../hooks/useDeleteSite';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function SitesList() {
  const navigate = useNavigate();
  const { sites, loading: listLoading, error: listError, refetch } = useGetSites();
  const { deleteSite, loading: deleting, success: deleteSuccess, error: deleteError } = useDeleteSite();

  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return sites.filter((item) => {
      if (!searchQuery) return true;
      return (
        String(item.site_id).includes(searchQuery) ||
        (item.name && item.name.toLowerCase().includes(searchQuery))
      );
    });
  }, [sites, searchQuery]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.SITE_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.SITE_EDIT(id)));
  };

  const handleDeleteButton = async (id) => {
    const userConfirmation = window.confirm('Este sitio se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    await deleteSite(id);
    await refetch();
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          placeholder="Buscar sede"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar sede"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Institución</th>
              <th>Ciudad</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.site_id}>
                <td>{item.name}</td>
                <td>{item.institution_id}</td>
                <td>{item.city}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.site_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.site_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.site_id), className: 'text-red-600' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SitesList;
