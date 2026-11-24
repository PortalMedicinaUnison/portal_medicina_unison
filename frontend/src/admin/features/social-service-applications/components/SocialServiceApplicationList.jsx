import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteSocialServiceApplication from '../hooks/useDeleteSocialServiceApplication';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { APPLICATION_STATUS_LABELS, PERIOD_LABELS, labelOf } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';
import InscriptionProgress from '../../../../features/expediente/components/InscriptionProgress';


function SocialServiceApplicationList({ applications, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteApplication, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteSocialServiceApplication();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!applications) return [];
    return applications.filter((item) => {
      if (statusFilter !== '' && item.status !== Number(statusFilter)) return false;
      if (!searchQuery) return true;

      const academicId = String(item.academic_id ?? '').toLowerCase();
      const studentName = formatFullName(item.student).toLowerCase();
      return academicId.includes(searchQuery) || studentName.includes(searchQuery);
    });
  }, [applications, searchQuery, statusFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_DETAIL(id)));
  const handleDeleteButton = (id) => {
    setItem(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deleteApplication(item);
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
        title="No se pudo cargar la lista de asignaciones"
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
          placeholder="Buscar por expediente o nombre"
        />
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estatus"
        >
          <option value="">Estatus</option>
          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-2/12'>Expediente</th>
              <th className='w-3/12'>Alumno</th>
              <th className='w-2/12'>Promoción</th>
              <th className='w-2/12'>Estatus</th>
              <th className='w-2/12'>Documentos</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                {search || statusFilter
                  ? 'No se encontraron asignaciones que coincidan con los filtros.'
                  : 'No hay asignaciones de servicio social registradas.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.application_id}>
                <td>{item.academic_id}</td>
                <td className="text-left">{formatFullName(item.student) || 'Sin datos del alumno'}</td>
                <td>{item.promotion ? `${item.promotion.year} - ${labelOf(PERIOD_LABELS, item.promotion.period)}` : '—'}</td>
                <td>{labelOf(APPLICATION_STATUS_LABELS, item.status)}</td>
                <td><InscriptionProgress progress={item.inscription_progress} /></td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.application_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.application_id), className: 'text-red-600' },
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
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar la asignación?"
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
          message={deleteError || 'Ocurrió un problema al eliminar la asignación.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default SocialServiceApplicationList;
