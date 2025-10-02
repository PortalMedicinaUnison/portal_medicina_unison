import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeletePromotion from '../hooks/useDeletePromotion';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function PromotionList({ promotions, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deletePromotion, loading: deleting, success: deleted,  error: deleteError, reset } = useDeletePromotion();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [yearFilter, setTypeFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    return promotions.filter((item) => {
      if (statusFilter !== '' && item.is_finished !== (statusFilter === 'true')) return false;
    });
  }, [promotions, statusFilter, yearFilter, periodFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deletePromotion(item);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  }

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      setItem(null);
      refetch();
      reset();
    }
  }, [deleted, refetch, reset]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la lista de promociones"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!promotions) {
    return (
      <DataLoadError
        title="404"
        titleClassName="text-5xl"
        message="No se encontraron promociones."
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
        <select
          className="btn-tertiary--light"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          aria-label="Filtrar por año"
        >
          <option value="">Año</option>
          <option value="1">General</option>
          <option value="2">Internado</option>
        </select>
        <select
          className="btn-tertiary--light"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          aria-label="Filtrar por periodo"
        >
          <option value="">Periodo</option>
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
          <option value="true">Activa</option>
          <option value="false">Inactiva</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12'>Año</th>
              <th className='w-3/12'>Periodo</th>
              <th className='w-5/12'>Estatus</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                {(yearFilter || periodFilter || statusFilter)
                  ? 'No se encontraron promociones que coincidan con los filtros.' 
                  : 'No hay promociones disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.promotion_id}>
                <td className="text-left">{item.year}</td>
                <td className="text-left">{item.period}</td>
                <td>{item.is_finished ? 'Activa' : 'Inactiva'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.promotion_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.promotion_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.promotion_id), className: 'text-red-600' },
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

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message="Ocurrió un problema al eliminar el registro."
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default PromotionList;
