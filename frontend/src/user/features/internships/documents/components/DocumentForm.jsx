import { useState, useEffect, useCallback } from "react";
import useCreateDocument from '../hooks/useCreateDocument';
import FileDropzone from "../../../../../utils/ui/FileDropzone";


const INITIAL_FORM = {
  documentType: '0',
  file: null,
};

function DocumentForm({ internshipId, onClose, onSuccess }) {
  const { createDocument, loading: saving, success: saved, error: saveError, reset } = useCreateDocument();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? checked :
        type === 'file' ? (files && files[0] ? files[0] : null) :
        value,
    }));

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!formData.documentType || formData.documentType === "0") errors.push('Selecciona un tipo de documento.');
    if (!formData.file) { 
      errors.push('Selecciona un archivo.');
    } else {
      if (formData.file.type !== 'application/pdf') {
        errors.push('El archivo debe ser un PDF.');
      } 
      if (formData.file.size > 5 * 1024 * 1024) {
        errors.push('El archivo no debe exceder los 5MB.');
      }
    }

    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const fd = new FormData();
    fd.append('document_type', formData.documentType);
    fd.append('file', formData.file);
    
    await createDocument(internshipId, fd);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setFormData(INITIAL_FORM);
      onSuccess?.();
    }
  }, [saved, onSuccess]);

// ---------------------- LOADING & ERROR STATES ----------------------

    
// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          Documento registrado exitosamente.
        </div>
      )}

      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div className="flex flex-col mt-12 gap-12">
        <div className="flex gap-4">
          <label>
            Tipo de documento
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className=""
            disabled={saving}
            required
          >
            <option value={0}>Seleccionar tipo</option>
            <option value={1}>Bitacora</option>
            <option value={2}>Kardex</option>
            <option value={3}>Certificado</option>
            <option value={4}>Carta de finalización</option>
          </select>
        </div>

        <FileDropzone
          label={formData.file?.name ?? 'Seleccionar documento'}
          sublabel={
            formData.file
              ? `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB`
              : '(Solo archivos PDF, máximo 5MB)'
          }
          acceptedFormats=".pdf"
          onFileSelect={(file) => setFormData(prev => ({ ...prev, file: file }))}
          disabled={saving}
        />

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>          
    </form>
  );
}

export default DocumentForm;