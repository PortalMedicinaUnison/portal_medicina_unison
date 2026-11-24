import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import useDeleteReport from '../hooks/useDeleteReport';
import { REPORT_TYPES, REPORT_TYPE_LABELS, labelOf } from '../../../../utils/constants';
import { formatDate } from '../../../../utils/utils';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


// «Otro» muestra también lo que escribió el estudiante.
const getReportTypeText = (report) => {
  const label = labelOf(REPORT_TYPE_LABELS, report.report_type);
  return Number(report.report_type) === REPORT_TYPES.OTHER && report.other_type
    ? `${label}: ${report.other_type}`
    : label;
};

function ReportList({ reports, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteReport, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteReport();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!reports) return [];
    return reports.filter((report) => {
      if (typeFilter !== '' && String(report.report_type) !== typeFilter) return false;
      if (statusFilter !== '' && String(report.is_open) !== statusFilter) return false;
      if (!searchQuery) return true;

      const description = String(report.description ?? '').toLowerCase();
      const type = getReportTypeText(report).toLowerCase();
      const site = String(report.site?.name ?? '').toLowerCase();
      return description.includes(searchQuery) || type.includes(searchQuery) || site.includes(searchQuery);
    });
  }, [reports, searchQuery, statusFilter, typeFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(ROUTES.USER.REPORT_DETAIL(id));
  const handleEditButton = (id) => navigate(ROUTES.USER.REPORT_EDIT(id));
  const handleDeleteButton = (id) => {
    setItem(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deleteReport(item);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  };

  const handleCloseError = () => {
    setShowErrorDialog(false);
    setItem(null);
    reset();
    // Si la coordinación cerró el reporte mientras tanto (409), se refleja su nuevo estado.
    refetch();
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
        message={fetchError}
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
          placeholder="Buscar"
        />
        <select
          className="btn-tertiary--light"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="">Tipo</option>
          {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estatus"
        >
          <option value="">Estatus</option>
          <option value="true">Abierto</option>
          <option value="false">Cerrado</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-2/12'>Fecha</th>
              <th className='w-3/12'>Tipo</th>
              <th className='w-4/12 hidden md:table-cell'>Descripción</th>
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
                  : 'Aún no has registrado reportes.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
              <tr key={report.report_id}>
                <td>{formatDate(report.date_report)}</td>
                <td>{getReportTypeText(report)}</td>
                <td className="text-left hidden md:table-cell">{report.description}</td>
                <td>{report.is_open ? 'Abierto' : 'Cerrado'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(report.report_id) },
                      // Solo se puede editar o eliminar mientras el reporte siga abierto.
                      ...(report.is_open
                        ? [
                            { label: 'Editar', onClick: () => handleEditButton(report.report_id) },
                            { label: 'Eliminar', onClick: () => handleDeleteButton(report.report_id), className: 'text-red-600' },
                          ]
                        : []),
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
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este reporte?"
          onConfirm={handleConfirmDelete}
          primaryLabel={deleting ? 'Eliminando...' : 'Eliminar'}
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message={deleteError || 'Ocurrió un problema al eliminar el reporte.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default ReportList;
