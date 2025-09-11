import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api.js';
import { ROUTES, adminAbs } from '../../../../config.js';
import useGetPromotions from '../hooks/useGetPromotions';

function PromotionsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('available');

  const { promotions, loading, error, refetch } = useGetPromotions();

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(id)));
  };

  const handleDeleteButton = async (id) => {
    const ok = window.confirm('Esta promoción se eliminará. ¿Deseas continuar?');
    if (!ok) return;
    try {
      await api.delete(`/promotions/${id}`);
      await refetch();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const searchQuery = search.trim().toLowerCase();
  const filtered = promotions.filter((promotion) => {
    if (!searchQuery) return true;
    return (
      String(promotion.promotion_id).includes(searchQuery) ||
      String(promotion.year).includes(searchQuery) ||
      String(promotion.period).toLowerCase().includes(searchQuery) ||
      (promotion.name && promotion.name.toLowerCase().includes(searchQuery))
    );
  });

  if (loading) return <p>Cargando promociones…</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          className="form-input--sm"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar promoción"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              <th>ID</th>
              <th>Año</th>
              <th>Periodo</th>
              <th>¿Activa?</th>
              <th></th>
              <th></th>
              {statusFilter !== 'unavailable' && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.promotion_id}>
                <td>{item.promotion_id}</td>
                <td>{item.year}</td>
                <td>{item.period}</td>
                <td>{item.is_finished ? 'No' : 'Sí'}</td>
                <td>
                  <button className="item-link" onClick={() => handleViewButton(item.promotion_id)}>
                    Ver
                  </button>
                </td>
                <td>
                  <button className="item-link" onClick={() => handleEditButton(item.promotion_id)}>
                    Editar
                  </button>
                </td>
                {statusFilter !== 'unavailable' && (
                  <td>
                    <button className="table-action" onClick={() => handleDeleteButton(item.promotion_id)}>
                      Borrar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PromotionsList;
