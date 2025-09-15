  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { ROUTES, adminAbs } from '../../../../../config';
  import useGetPsds from '../hooks/useGetPsds';
  import useDeletePsd from '../hooks/useDeletePsd';

  function PsdList() {
    const navigate = useNavigate();
    const { psds, loading: listLoading, error: listError, refetch } = useGetPsds();
    const { deletePsd, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePsd();
    const [search, setSearch] = useState('');

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

    const filtered = psds.filter((psd) => {
      const searchQuery = search.trim().toLowerCase();
      if (!searchQuery) return true;
      return (
        String(psd.site_id).toLowerCase().includes(searchQuery)
      );
    });

    if (listLoading) return <p>Cargando registros…</p>;
    if (listError) return <p>Error es: {String(listError)}</p>;

    return (
      <div className="table-container">
        <div className="table-container-actions">
          <input
            className="form-input--sm"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por sede"
          />
        </div>

        <div className="table-container-body">
          <table className="table">
            <thead className="text-xs text-gray-700 bg-gray-50">
              <tr>
                <th>Sede</th>
                <th>Capacidad</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.psd_id}>
                  <td>{item.site.name}</td>
                  <td>{item.capacity}</td>
                  <td>
                    <button className="item-link" onClick={() => handleViewButton(item.psd_id)}>
                      Ver
                    </button>
                  </td>
                  <td>
                    <button className="item-link" onClick={() => handleEditButton(item.psd_id)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => handleDeleteButton(item.psd_id)}
                      disabled={deleting}
                    >
                      {deleting ? 'Borrando…' : 'Borrar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  export default PsdList;
