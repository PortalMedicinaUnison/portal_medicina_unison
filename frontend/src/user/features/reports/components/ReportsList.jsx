import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import useDeleteReport from '../hooks/useDeleteReport'
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function ReportList({ reports, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteReport, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteReport();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------
 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const REPORT_TYPES = {
    1: 'Accidente',
    2: 'Condiciones inseguras',
    3: 'Acoso laboral',
    4: 'Acoso sexual',
    5: 'Discriminación',
    6: 'Robo o hurto',
    7: 'Otro',
  };

  const getReportTypeName = (type) => REPORT_TYPES[type] || 'Desconocido';

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!reports) return [];
    return reports.filter((item) => {
      if (typeFilter !== '' && String(item.type) !== typeFilter) return false;
      if (statusFilter !== '' && String(item.is_open) !== statusFilter) return false;
      if (!searchQuery) return true;

      const title = String(item.title).toLowerCase();
      const description = String(item.description).toLowerCase();
      return title.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [reports, searchQuery, statusFilter, typeFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(ROUTES.USER.REPORT_DETAIL(id));
  const handleEditButton = (id) => navigate(ROUTES.USER.REPORT_EDIT(id));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteReport(item);
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
        title="No se pudo cargar la información"
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
          placeholder="Buscar por título o descripción"
        />
         <select
          className="btn-tertiary--light"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filtrar por ambito"
        >
          <option value="">Ámbito</option>
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
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-2/12'>Internado</th>
              <th className='w-2/12'>Fecha</th>
              <th className='w-4/12'>Descripción</th>
              <th className='w-2/12'>Estatus</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                {search || statusFilter || typeFilter 
                  ? 'No se encontraron reportes que coincidan con los filtros.' 
                  : 'No hay reportes disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.report_id}>
                <td>{item.internship_id}</td>
                <td>{item.date}</td>
                <td className="text-left">{item.description}</td>
                <td>{item.is_open ? 'Abierto' : 'Cerrado'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.report_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.report_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.report_id), className: 'text-red-600' },
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
          message="Ocurrió un problema al eliminar el registro"
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
      
    </div>
  );
}
    
export default ReportList;
