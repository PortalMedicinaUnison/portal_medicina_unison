import { useState, useEffect } from 'react';
import useGetDocumentsByInternship from '../hooks/useGetDocumentsByInternship';
import useDeleteDocument from '../hooks/useDeleteDocument';
import useDocumentLinks from '../hooks/useDocumentsLinks';
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';
import { DOCUMENT_TYPE_LABELS, labelOf } from '../../../../../utils/constants';
import { formatDateTime } from '../../../../../utils/utils';


// Documentos que subió el alumno a su internado. La administración solo los consulta o elimina.
function DocumentList({ internshipId }) {
  const { documents, loading: fetching, error: fetchError, refetch } = useGetDocumentsByInternship(internshipId);
  const { deleteDocument, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteDocument();
  const { openView, openDownload, loading: opening, error: fileError, reset: resetFileError } = useDocumentLinks(internshipId);

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = (id) => {
    setItem(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deleteDocument(internshipId, item);
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

  if (fetching) return <LoadingSpinner size="h-24" />;

  if (fetchError) {
    return (
      <div className="alert-error items-center" role="alert">
        <span>{fetchError}</span>
        <button type="button" className="font-semibold underline" onClick={refetch}>
          Reintentar
        </button>
      </div>
    );
  }

// ---------------------- RENDER ----------------------

  return (
    <div className="table-container">
      {fileError && (
        <div className="alert-error items-center" role="alert">
          <span>{fileError}</span>
          <button type="button" className="font-semibold underline" onClick={resetFileError}>
            Cerrar
          </button>
        </div>
      )}

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12'>Documento</th>
              <th className='w-5/12'>Archivo</th>
              <th className='w-3/12'>Fecha de carga</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  El alumno aún no ha subido documentos.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
              <tr key={doc.document_id}>
                <td className="text-left">{labelOf(DOCUMENT_TYPE_LABELS, doc.document_type)}</td>
                <td className="text-left" title={doc.original_filename ?? undefined}>{doc.original_filename || '—'}</td>
                <td>{formatDateTime(doc.created_at)}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => openView(doc.document_id) },
                      { label: 'Descargar', onClick: () => openDownload(doc.document_id, doc.original_filename) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(doc.document_id), className: 'text-red-600' },
                    ]}
                    disabled={deleting || opening}
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
          message="Esta acción no se puede deshacer; el alumno podrá subir de nuevo un documento de este tipo. ¿Deseas eliminarlo?"
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
          message={deleteError || 'Ocurrió un problema al eliminar el documento.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
    </div>
  );
}

export default DocumentList;
