import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetPromotions from '../hooks/useGetPromotions';
import useDeletePromotion from '../hooks/useDeletePromotion';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';


function PromotionsList() {
  const navigate = useNavigate();
  const { promotions, loading: listLoading, error: listError, refetch } = useGetPromotions();
  const { deletePromotion, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePromotion();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const yearOptions = useMemo(() => {
    const ys = new Set(
      promotions
        .map(p => p?.year)
        .filter(y => y !== undefined && y !== null && y !== '')
        .map(String)
    );
    return Array.from(ys).sort((a, b) => Number(b) - Number(a));
  }, [promotions]);

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return promotions.filter((promotion) => {
      if (yearFilter && String(promotion.year) !== yearFilter) 
        return false;
      
      if (statusFilter !== '') {
        const isFinished = statusFilter === 'true';
        if (promotion.is_finished !== isFinished) 
          return false;
      }
  
      if (!searchQuery) return true;
      return (
        String(promotion.promotion_id).includes(searchQuery) ||
        String(promotion.year).includes(searchQuery) ||
        (promotion.name && promotion.name.toLowerCase().includes(searchQuery))
      );
    });
  }, [promotions, searchQuery, yearFilter, statusFilter]);

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

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
          <input
            type="text"
            className="form-input--sm mr-auto"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar"
          />

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
          <option value="false">Activa</option>
          <option value="true">Finalizada</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th>Año</th>
              <th>Periodo</th>
              <th>Estatus</th>
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
                <tr key={item.promotion_id}>
                  <td>{item.year}</td>
                  <td>{item.period}</td>
                  <td>{item.is_finished ? 'Finalizada' : 'Activa'}</td>
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

export default PromotionsList;
