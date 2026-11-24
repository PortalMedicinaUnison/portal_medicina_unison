import { useState, useEffect, useMemo } from 'react';
import useDeletePsd from '../hooks/useDeletePsd';
import PsdForm from './PsdForm';
import PsdUpdate from './PsdUpdate';
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../../utils/ui/DataLoadError';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';


// Lista editable de cupos por sede. Los datos llegan del padre (useGetPsdsByProm) para que
// crear, editar o eliminar un cupo recargue la misma lista con `refetch`.
function PsdList({ psds, fetching, fetchError, refetch, promotionId }) {
  const { deletePsd, loading: deleting, success: deleted, error: deleteError, reset } = useDeletePsd();

  const [item, setItem] = useState(null);
  const [editingPsd, setEditingPsd] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!psds) return [];

    return psds.filter((item) => {
      if (!searchQuery) return true;

      const site = String(item.site?.name ?? '').toLowerCase();
      return site.includes(searchQuery);
    });
  }, [psds, searchQuery]);

  const assignedSiteIds = useMemo(() => (psds || []).map((psd) => psd.site_id), [psds]);

// ---------------------- HANDLERS ----------------------

  const handleAddButton = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);
  const handleCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleEditButton = (psd) => setEditingPsd(psd);
  const handleCloseEdit = () => setEditingPsd(null);
  const handleUpdated = () => {
    setEditingPsd(null);
    refetch();
  };

  const handleDeleteButton = (id) => {
    setItem(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deletePsd(item);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  };

  // Tras un error (p. ej. 409: la sede ya tiene internos) se recarga para mostrar la ocupación real.
  const handleCloseError = () => {
    setShowErrorDialog(false);
    setItem(null);
    reset();
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
        title="No se pudieron cargar los cupos"
        message="Intenta recargar la información."
        details={fetchError}
        onRetry={refetch}
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
          placeholder="Buscar por sede"
          aria-label="Buscar por sede"
        />
        <button
          type="button"
          className="btn-primary"
          onClick={handleAddButton}
        >
          Añadir sede
        </button>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-7/12'>Sede</th>
              <th className='w-4/12'>Ocupados / Cupos</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                {search
                  ? 'No se encontraron sedes que coincidan con la búsqueda.'
                  : 'Esta promoción aún no tiene sedes asignadas.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((psd) => (
              <tr key={psd.psd_id}>
                <td className="text-left">{psd.site?.name}</td>
                <td>{psd.occupied ?? 0} / {psd.capacity}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Editar cupos', onClick: () => handleEditButton(psd) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(psd.psd_id), className: 'text-red-600' },
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

      <Modal
        open={showCreateModal}
        title="Añadir cupos a una sede"
        onClose={handleCloseCreate}
      >
        <PsdForm
          promotionId={promotionId}
          assignedSiteIds={assignedSiteIds}
          onClose={handleCloseCreate}
          onSuccess={handleCreated}
        />
      </Modal>

      <Modal
        open={editingPsd !== null}
        title="Editar cupos"
        onClose={handleCloseEdit}
      >
        {editingPsd && (
          <PsdUpdate
            psd={editingPsd}
            onClose={handleCloseEdit}
            onSuccess={handleUpdated}
          />
        )}
      </Modal>

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
          message={deleteError || 'Ocurrió un problema al eliminar la sede.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default PsdList;
