import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteReport from '../hooks/useDeleteReport';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { REPORT_TYPES, REPORT_TYPE_LABELS, labelOf } from '../../../../utils/constants';
import { formatDate, formatFullName } from '../../../../utils/utils';


const getReportTypeLabel = (report) =>
  report.report_type === REPORT_TYPES.OTHER && report.other_type
    ? `Otro: ${report.other_type}`
    : labelOf(REPORT_TYPE_LABELS, report.report_type);

// Los reportes anónimos llegan sin `student` ni `academic_id` para la administración.
const getReporterLabel = (report) => {
  const { student, academic_id: academicId } = report;
  if (report.anonymity) return 'Anónimo';
  if (student) {
    const name = formatFullName(student);
    return academicId ? `${name} (${academicId})` : name;
  }
  return academicId ?? 'Anónimo';
};

function ReportList({ reports, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteReport, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteReport();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    if (!reports) return [];
    return reports.filter((item) => {
      if (statusFilter !== '' && item.is_open !== (statusFilter === 'true')) return false;
      if (typeFilter !== '' && item.report_type !== Number(typeFilter)) return false;
      return true;
    });
  }, [reports, statusFilter, typeFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.REPORT_DETAIL(id)));
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
        title="No se pudo cargar la lista de reportes"
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
        <select
          className="btn-tertiary--light"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="">Tipo</option>
          {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
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
              <th className='w-2/12'>Tipo</th>
              <th className='w-3/12'>Sede</th>
              <th className='w-3/12'>Alumno</th>
              <th className='w-1/12'>Estatus</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                {typeFilter || statusFilter
                  ? 'No se encontraron reportes que coincidan con los filtros.'
                  : 'No hay reportes registrados.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.report_id}>
                <td>{formatDate(item.date_report)}</td>
                <td className="text-left" title={getReportTypeLabel(item)}>{getReportTypeLabel(item)}</td>
                <td className="text-left">{item.site?.name ?? '—'}</td>
                <td className="text-left">{getReporterLabel(item)}</td>
                <td>{item.is_open ? 'Abierto' : 'Cerrado'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.report_id) },
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
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar el reporte?"
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
          message={deleteError || 'Ocurrió un problema al eliminar el reporte.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default ReportList;
