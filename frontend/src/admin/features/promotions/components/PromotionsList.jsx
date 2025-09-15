import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';
import useGetPromotions from '../hooks/useGetPromotions';
import useDeletePromotion from '../hooks/useDeletePromotion';


function PromotionsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [openMenuRow, setOpenMenuRow] = useState(null);

  const { promotions, loading: listLoading, error: listError, refetch } = useGetPromotions();
  const { deletePromotion, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePromotion();


  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('[data-row-menu]')) setOpenMenuRow(null);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpenMenuRow(null);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

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
    const userConfirmation = window.confirm('Esta promoción se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;

    await deletePromotion(id);
    await refetch();
  };

  const searchQuery = search.trim().toLowerCase();
  const filtered = promotions.filter((promotion) => {
    if (yearFilter && String(promotion.year) !== yearFilter) return false;

    if (statusFilter !== '') {
      if (promotion.is_finished !== true) return false;
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
  if (listError) return <p>Error es: {String(listError)}</p>;



  return (
    <div className="table-container">
      <div className="table-container-actions">
        <select
          className="btn-tertiary--light"
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
          className="btn-tertiary--light"
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
          <thead>
            <tr>
              <th>Año</th>
              <th>Periodo</th>
              <th>¿Activa?</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.promotion_id}>
                <td>{item.year}</td>
                <td>{item.period}</td>
                <td>{item.is_finished ? 'No' : 'Sí'}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right">
                <div data-row-menu className="inline-block text-left">
                  <button
                      type="button"
                      onClick={() => setOpenMenuRow(prev => prev === item.promotion_id ? null : item.promotion_id)}
                      aria-haspopup="menu"
                      aria-expanded={openMenuRow === item.promotion_id}
                      className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring"
                      title="Acciones"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 z-0">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>

                    {openMenuRow === item.promotion_id && (
                      <div
                        role="menu"
                        className="absolute right-0 z-20 mt-1 w-36 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                      >
                        <button
                          role="menuitem"
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => { setOpenMenuRow(null); handleViewButton(item.promotion_id); }}
                          >
                          Ver
                        </button>
                        <button
                          role="menuitem"
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => { setOpenMenuRow(null); handleEditButton(item.promotion_id); }}
                          >
                          Editar
                        </button>
                        <button
                          role="menuitem"
                          className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          onClick={() => { setOpenMenuRow(null); handleDeleteButton(item.promotion_id); }}
                          >
                          Borrar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PromotionsList;
