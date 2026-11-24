import { useState, useEffect, useMemo } from 'react';
import useDeleteSocialServiceDocument from '../hooks/useDeleteSocialServiceDocument';
import useGetDocumentsBySocialService from '../hooks/useGetDocumentsBySocialService';
import useSocialServiceDocumentLinks from '../hooks/useSocialServiceDocumentLinks';
import SocialServiceDocumentForm from './SocialServiceDocumentForm';
import {
  SOCIAL_SERVICE_DOCUMENT_TYPES,
  SOCIAL_SERVICE_DOCUMENT_TYPE_LABELS,
  labelOf,
} from '../../../../../utils/constants';
import { formatDateTime } from '../../../../../utils/utils';
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../../utils/ui/DataLoadError';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';


const ALL_DOCUMENT_TYPES = Object.values(SOCIAL_SERVICE_DOCUMENT_TYPES);

const fileNameOf = (doc) => doc.original_filename || `documento_${doc.document_id}.pdf`;

function SocialServiceDocumentList({ socialServiceId }) {
  const { documents, loading: fetching, error: fetchError, refetch } = useGetDocumentsBySocialService(socialServiceId);
  const { deleteDocument, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteSocialServiceDocument();
  const { openView, openDownload, error: fileError, clearError: clearFileError } = useSocialServiceDocumentLinks(socialServiceId);

  const [item, setItem] = useState(null); // documento a eliminar
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [notice, setNotice] = useState('');

  // Tipos que ya tienen un documento activo (solo se permite uno por tipo).
  const usedTypes = useMemo(() => documents.map((doc) => Number(doc.document_type)), [documents]);
  const missingTypes = ALL_DOCUMENT_TYPES.filter((type) => !usedTypes.includes(type));

// ---------------------- HANDLERS ----------------------

  const handleUploadButton = () => {
    setNotice('');
    clearFileError();
    setShowUpload(true);
  };

  const handleCloseUpload = () => setShowUpload(false);

  const handleUploaded = () => {
    setShowUpload(false);
    setNotice('Documento subido correctamente.');
    refetch();
  };

  const handleView = (doc) => {
    setNotice('');
    openView(doc);
  };

  const handleDownload = (doc) => {
    setNotice('');
    openDownload(doc);
  };

  const handleDeleteButton = (doc) => {
    setNotice('');
    clearFileError();
    setItem(doc);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return;
    await deleteDocument(socialServiceId, item.document_id);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  };

  const handleCloseError = () => {
    setShowErrorDialog(false);
    setItem(null);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      setItem(null);
      setNotice('Documento eliminado. Ya puedes subir otro de ese tipo.');
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

  // Al recargar después de subir o eliminar se mantiene la tabla en lugar de volver al spinner.
  if (fetching && documents.length === 0) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudieron cargar tus documentos"
        message={fetchError}
        onRetry={refetch}
      />
    );
  }

// ---------------------- RENDER ----------------------
  return (
    <div className="table-container lg:w-3/4">
      <div className="table-container-actions">
        <p className="mr-auto text-gray-500">
          {missingTypes.length > 0
            ? `Pendientes: ${missingTypes.map((type) => SOCIAL_SERVICE_DOCUMENT_TYPE_LABELS[type]).join(', ')}.`
            : 'Ya subiste todos los documentos.'}
        </p>
        <button
          type="button"
          className="btn-primary disabled:opacity-50"
          onClick={handleUploadButton}
          disabled={missingTypes.length === 0 || fetching}
        >
          Subir documento
        </button>
      </div>

      {notice && <div className="alert-success">{notice}</div>}

      {fileError && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{fileError}</span>
        </div>
      )}

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12 text-left'>Documento</th>
              <th className='w-5/12 text-left'>Archivo</th>
              <th className='w-3/12'>Fecha de carga</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Aún no has subido documentos.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
              <tr key={doc.document_id}>
                <td className="text-left">{labelOf(SOCIAL_SERVICE_DOCUMENT_TYPE_LABELS, doc.document_type)}</td>
                <td className="text-left">
                  <button
                    type="button"
                    className="attachment-link truncate max-w-full"
                    title={`Ver ${fileNameOf(doc)}`}
                    onClick={() => handleView(doc)}
                  >
                    {fileNameOf(doc)}
                  </button>
                </td>
                <td>{formatDateTime(doc.created_at)}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleView(doc) },
                      { label: 'Descargar', onClick: () => handleDownload(doc) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(doc), className: 'text-red-600' },
                    ]}
                    disabled={deleting || fetching}
                  />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showUpload} title="Subir documento" onClose={handleCloseUpload}>
        <SocialServiceDocumentForm
          socialServiceId={socialServiceId}
          usedTypes={usedTypes}
          onCancel={handleCloseUpload}
          onSuccess={handleUploaded}
        />
      </Modal>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message={
            item
              ? `Se eliminará "${labelOf(SOCIAL_SERVICE_DOCUMENT_TYPE_LABELS, item.document_type)}" (${fileNameOf(item)}). Después podrás subir otro documento de ese tipo. ¿Deseas continuar?`
              : 'Esta acción no se puede deshacer. ¿Deseas continuar?'
          }
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
          message={deleteError || 'Ocurrió un problema al eliminar el documento.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

    </div>
  );
}

export default SocialServiceDocumentList;
