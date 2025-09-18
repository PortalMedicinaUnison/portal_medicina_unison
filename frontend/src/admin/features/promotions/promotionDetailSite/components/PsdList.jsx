import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../../config';
import useGetPsds from '../hooks/useGetPsds';
import useDeletePsd from '../hooks/useDeletePsd';
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';


function PsdList() {
  const navigate = useNavigate();
  const { psds, loading: listLoading, error: listError, refetch } = useGetPsds();
  const { deletePsd, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePsd();
  
  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return psds.filter((psd) => {
    if (!searchQuery) return true;
    return (
      String(psd.site.name).toLowerCase().includes(searchQuery)
    );
  });
  }, [psds, searchQuery]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PSD_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PSD_EDIT(id)));
  };

  const handleDeleteButton = async (id) => {
    const userConfirmation = window.confirm('Este registro se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    await deletePsd(id);
    await refetch();
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm"
          placeholder="Buscar sede"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Capacidad</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">No se encontraron instituciones.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.psd_id}>
                  <td>{item.site.name}</td>
                  <td>{item.capacity}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="td-actions text-right">
                    <DropdownMenu actions={
                      [
                        { label: 'Ver', onClick: () => handleViewButton(item.promotion_id) },
                        { label: 'Editar', onClick: () => handleEditButton(item.promotion_id) },
                        { label: 'Eliminar', onClick: () => handleDeleteButton(item.promotion_id), className: 'text-red-600' },
                      ]
                    } />
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

export default PsdList;
