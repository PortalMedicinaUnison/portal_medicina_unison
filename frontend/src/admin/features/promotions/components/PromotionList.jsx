import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeletePromotion from '../hooks/useDeletePromotion';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { PROGRAM_LABELS, labelOf } from '../../../../utils/constants';
import { promotionLabel } from '../../../../utils/utils';
import { INSCRIPTION_PROGRAMS } from '../../inscriptions/programs';
import { promotionStatus } from '../promotionDates';


// program: si la pantalla ya viene filtrada por programa (?program=), no se muestra ese filtro ni su columna.
function PromotionList({ promotions, fetching, fetchError, refetch, program = null }) {
  const navigate = useNavigate();
  const { deletePromotion, loading: deleting, success: deleted,  error: deleteError, reset } = useDeletePromotion();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [programFilter, setProgramFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const years = useMemo(
    () => [...new Set((promotions || []).map(p => p.year))].sort((a,b) => b - a),
    [promotions]
  );

  const filtered = useMemo(() => {
    if (!promotions) return [];

    return promotions.filter((item) => {
      if (programFilter !== '' && String(item.program) !== programFilter) return false;
      if (statusFilter !== '' && item.is_finished !== (statusFilter === 'true')) return false;
      if (yearFilter !== '' && item.year.toString() !== yearFilter) return false;
      return true;
    });
  }, [promotions, programFilter, yearFilter, statusFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(id)));
  const handleInscriptionsButton = (promotion) =>
    navigate(`${INSCRIPTION_PROGRAMS[promotion.program].listPath}?promotion_id=${promotion.promotion_id}`);
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

// ---------------------- RENDER ----------------------
  return (
    <div className="table-container">
      <div className="table-container-actions">
        {!program && (
          <select
            className="btn-tertiary--light"
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            aria-label="Filtrar por programa"
          >
            <option value="">Programa</option>
            {Object.entries(PROGRAM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        )}
        <select
          className="btn-tertiary--light"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          aria-label="Filtrar por año"
        >
          <option value="">Año</option>
            {years.map(y => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
        </select>
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Estatus</option>
          <option value="false">Sin finalizar</option>
          <option value="true">Finalizada</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              {!program && <th className='w-3/12'>Programa</th>}
              <th className={program ? 'w-8/12' : 'w-5/12'}>Promoción</th>
              <th className='w-3/12'>Estatus</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={program ? 3 : 4} className="text-center py-6">
                {(programFilter || yearFilter || statusFilter)
                  ? 'No se encontraron promociones que coincidan con los filtros.' 
                  : 'No hay promociones disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.promotion_id}>
                {!program && <td>{labelOf(PROGRAM_LABELS, item.program)}</td>}
                <td>{promotionLabel(item)}</td>
                <td>{promotionStatus(item)}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.promotion_id) },
                      { label: 'Editar fechas y cupos', onClick: () => handleEditButton(item.promotion_id) },
                      { label: 'Inscripciones', onClick: () => handleInscriptionsButton(item) },
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
          message={deleteError || 'Ocurrió un problema al eliminar el registro.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default PromotionList;
