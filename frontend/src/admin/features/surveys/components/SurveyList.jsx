import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteSurvey from '../hooks/useDeleteSurvey';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { formatDate } from '../../../../utils/utils';


function SurveyList({ surveys, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteSurvey, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteSurvey();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mandatoryStatus, setMandatoryStatus] = useState('');
  
  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!surveys) return [];
    return surveys.filter((item) => {
      if (mandatoryStatus !== '' && item.mandatory !== (mandatoryStatus === 'true')) return false;
      if (statusFilter !== '' && item.is_visible !== (statusFilter === 'true')) return false;
      if (!searchQuery) return true;

      const title = String(item.title ?? '').toLowerCase();
      const url = String(item.url ?? '').toLowerCase();
      const description = String(item.description ?? '').toLowerCase();
      return title.includes(searchQuery) || url.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [surveys, searchQuery, mandatoryStatus, statusFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.SURVEY_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.SURVEY_EDIT(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteSurvey(item);
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
        title="No se pudieron cargar las encuestas"
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
        <input
          type="text"
          className="form-input--sm mr-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, url o descripción"
          aria-label="Buscar por título, url o descripción"
        />
        <select
          className="btn-tertiary--light"
          value={mandatoryStatus}
          onChange={(e) => setMandatoryStatus(e.target.value)}
          aria-label="Filtrar por obligatoriedad"
        >
          <option value="">Obligatoriedad</option>
          <option value="true">Obligatoria</option>
          <option value="false">Opcional</option>
        </select>
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por visibilidad"
        >
          <option value="">Visibilidad</option>
          <option value="true">Visible</option>
          <option value="false">Oculta</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              {/* Sin ancho fijo: las 6 columnas de datos se reparten el espacio restante. */}
              <th>Título</th>
              <th>Enlace</th>
              <th>Descripción</th>
              <th>Vencimiento</th>
              <th>Obligatoriedad</th>
              <th>Visibilidad</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                {search || mandatoryStatus || statusFilter
                  ? 'No se encontraron encuestas que coincidan con los filtros.' 
                  : 'No hay encuestas disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.survey_id}>
                <td className="text-left">{item.title}</td>
                <td className="text-left">{item.url}</td>
                <td className="text-left">{item.description || '—'}</td>
                <td>{formatDate(item.expiration_date)}</td>
                <td>{item.mandatory ? 'Obligatoria' : 'Opcional'}</td>
                <td>{item.is_visible ? 'Visible' : 'Oculta'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.survey_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.survey_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.survey_id), className: 'text-red-600' },
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
          message={deleteError || 'Ocurrió un problema al eliminar la encuesta.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default SurveyList;
