import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteInternship from '../hooks/useDeleteInternship';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { INTERNSHIP_STATUS_LABELS, PERIOD_LABELS, labelOf } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';



function InternshipList({ internships, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteInternship, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteInternship();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!internships) return [];
    return internships.filter((item) => {
      if (statusFilter !== '' && item.status !== Number(statusFilter)) return false;
      if (!searchQuery) return true;

      const academicId = String(item.academic_id ?? '').toLowerCase();
      const studentName = formatFullName(item.application?.student).toLowerCase();
      return academicId.includes(searchQuery) || studentName.includes(searchQuery);
    });
  }, [internships, searchQuery, statusFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_DETAIL(id)));
  const handleDeleteButton = (id) => {
    setItem(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deleteInternship(item);
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
        title="No se pudo cargar la lista de internados"
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
          placeholder="Buscar por expediente o nombre"
        />
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estatus"
        >
          <option value="">Estatus</option>
          {Object.entries(INTERNSHIP_STATUS_LABELS).map(([value, label]) => (
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
              <th className='w-3/12'>Sede</th>
              <th className='w-2/12'>Promoción</th>
              <th className='w-1/12'>Estatus</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                {search || statusFilter
                  ? 'No se encontraron internados que coincidan con los filtros.'
                  : 'No hay internados registrados.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const promotion = item.application?.promotion;
                return (
                  <tr key={item.internship_id}>
                    <td>{item.academic_id}</td>
                    <td className="text-left">
                      <Link
                        to={adminAbs(ROUTES.ADMIN.INTERNSHIP_DETAIL(item.internship_id))}
                        className="hover:underline"
                      >
                        {formatFullName(item.application?.student) || 'Sin datos del alumno'}
                      </Link>
                    </td>
                    <td className="text-left">{item.site?.name ?? 'Sin sede'}</td>
                    <td>{promotion ? `${promotion.year} - ${labelOf(PERIOD_LABELS, promotion.period)}` : '—'}</td>
                    <td>{labelOf(INTERNSHIP_STATUS_LABELS, item.status)}</td>
                    <td className="overflow-visible text-right">
                      <DropdownMenu
                        actions={[
                          { label: 'Ver', onClick: () => handleViewButton(item.internship_id) },
                          { label: 'Eliminar', onClick: () => handleDeleteButton(item.internship_id), className: 'text-red-600' },
                        ]}
                        disabled={deleting}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Se dará de baja el internado y la asignación del alumno volverá a quedar pendiente. ¿Deseas continuar?"
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
          message={deleteError || 'Ocurrió un problema al eliminar el internado.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default InternshipList;
