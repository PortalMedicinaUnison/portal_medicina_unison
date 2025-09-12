import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';
import useGetPromotions from '../hooks/useGetPromotions';
import useDeletePromotion from '../hooks/useDeletePromotion';


function PromotionsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const { promotions, loading: listLoading, error: listError, refetch } = useGetPromotions();
  const { deletePromotion, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePromotion();

  const yearOptions = useMemo(() => {
    const ys = new Set(
      promotions
        .map(p => p?.year)
        .filter(y => y !== undefined && y !== null && y !== '')
        .map(String)
    );
    return Array.from(ys).sort((a, b) => Number(b) - Number(a));
  }, [promotions]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(id)));
  };

  const handleDeleteButton = async (id) => {
    const ok = window.confirm('Esta promoción se eliminará. ¿Deseas continuar?');
    if (!ok) return;

    const done = await deletePromotion(id);
    if (done) await refetch();
  };

  const searchQuery = search.trim().toLowerCase();
  const filtered = promotions.filter((promotion) => {
    if (yearFilter && String(promotion.year) !== yearFilter) return false;

    if (statusFilter !== '') {
      const wanted = statusFilter === 'true';
      if (p.is_finished !== wanted) return false;
    }

    if (!searchQuery) return true;
    return (
      String(promotion.promotion_id).includes(searchQuery) ||
      String(promotion.year).includes(searchQuery) ||
      String(promotion.period).toLowerCase().includes(searchQuery) ||
      (promotion.name && promotion.name.toLowerCase().includes(searchQuery))
    );
  });

  if (listLoading) return <p>Cargando promociones…</p>;
  if (listError) return <p>Error: {String(listError)}</p>;

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

        <select
          className="form-input--sm"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          aria-label="Filtrar por año"
        >
          <option value="">Todos los años</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="form-input--sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Estatus</option>
          <option value="false">Si</option>
          <option value="true">No</option>
        </select>
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
