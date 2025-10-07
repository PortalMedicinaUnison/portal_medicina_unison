import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../../config';
import useDeleteDocument from '../hooks/useDeleteDocument';
import useGetDocumentsByInternship from '../hooks/useGetDocumentsByInternship'
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../../utils/ui/DataLoadError';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';


function DocumentList({ internshipId }) {
  const navigate = useNavigate();
  const { documents, loading: fetching, error: fetchError, refetch } = useGetDocumentsByInternship(internshipId);
  const { deleteDocument, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteDocument();
  
  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

   
  const DOCUMENT_TYPES = {
    1: 'Bitacora',
    2: 'Kardex',
    3: 'Certificado',
    4: 'Carta de finalización',
  };

  const getDocumentTypeName = (typeEnum) => {
    return DOCUMENT_TYPES[typeEnum] || 'Desconocido';
  };

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteDocument(item);
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
    <div className="table-container lg:w-1/2">
      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12'>Documento</th>
              <th className='w-2/12'>Consultar</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {!documents || documents.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No hay documentos disponibles.
                </td>
              </tr>
            ) : (
              documents.map((item) => (
              <tr key={item.document_id}>
                <td className="text-left">{getDocumentTypeName(item.document_type)}</td>
                <td>{item.is_verified ? '📄' : '📄'}</td>
                <td className="overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.document_id), className: 'text-red-600' },
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
    
export default DocumentList;
