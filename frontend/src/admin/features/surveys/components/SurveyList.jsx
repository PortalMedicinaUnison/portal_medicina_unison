import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteSurvey from '../hooks/useDeleteSurvey';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function SurveyList({ surveys, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteSurvey, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteSurvey();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  const [mandatoryStatus, setMandatoryStatus] = useState('');
  
  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!surveys) return [];
    return surveys.filter((item) => {
      if (mandatoryStatus !== '' && item.mandatory !== (mandatoryStatus === 'true')) return false;
      if (!searchQuery) return true;

      const title = String(item.title).toLowerCase();
      const url = String(item.url).toLowerCase();
      const description = String(item.description).toLowerCase();
      return title.includes(searchQuery) || url.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [surveys, searchQuery, mandatoryStatus]);

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
        title="No se pudo cargar el anuncio"
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
        />
        <select
          className="btn-tertiary--light"
          value={mandatoryStatus}
          onChange={(e) => setMandatoryStatus(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Obligatoriedad</option>
          <option value="true">Obligatoria</option>
          <option value="false">Opcional</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-2/12'>Título</th>
              <th className='w-2/12'>Enlace</th>
              <th className='w-3/12'>Descripción</th>
              <th className='w-2/12'>Fecha de vencimiento</th>
              <th className='w-2/12'>Obligatoriedad</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                {search || mandatoryStatus 
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
                <td className="text-left">{item.description}</td>
                <td>{item.expiration_date}</td>
                <td>{item.mandatory ? 'Obligatoria' : 'Opcional'}</td>
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
          message="Ocurrió un problema al eliminar la encuesta"
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default SurveyList;
