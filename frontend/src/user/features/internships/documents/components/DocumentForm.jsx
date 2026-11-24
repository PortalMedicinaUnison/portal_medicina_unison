import { useState } from "react";
import useCreateDocument from '../hooks/useCreateDocument';
import FileDropzone from "../../../../../utils/ui/FileDropzone";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '../../../../../utils/constants';


// Igual que MAX_UPLOAD_MB del backend.
const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const PDF_MEDIA_TYPE = 'application/pdf';
const DOCUMENT_TYPE_OPTIONS = Object.values(DOCUMENT_TYPES);

const INITIAL_FORM = {
  documentType: '',
  file: null,
};

// Algunos sistemas no informan el tipo del archivo; en ese caso se revisa la extensión.
// El backend vuelve a comprobar que el contenido sea un PDF.
const isPdf = (file) => file.type === PDF_MEDIA_TYPE || (!file.type && /\.pdf$/i.test(file.name));

const getFileError = (file) => {
  if (!file) return 'Selecciona un archivo PDF.';
  if (!isPdf(file)) return 'El archivo debe ser un PDF.';
  if (file.size === 0) return 'El archivo está vacío.';
  if (file.size > MAX_FILE_BYTES) return `El archivo supera el tamaño máximo de ${MAX_FILE_MB} MB.`;
  return '';
};

/**
 * Props:
 * - internshipId: number
 * - usedTypes: number[] tipos que ya tienen un documento activo (no se pueden volver a subir)
 * - onCancel: () => void
 * - onSuccess: (document) => void  se llama después de guardar (el formulario ya quedó limpio)
 */
function DocumentForm({ internshipId, usedTypes = [], onCancel, onSuccess }) {
  const { createDocument, loading: saving, error: saveError, reset } = useCreateDocument();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  // Cambiarla vuelve a montar el FileDropzone (limpia el archivo elegido y su mensaje).
  const [dropzoneKey, setDropzoneKey] = useState(0);

// ---------------------- HANDLERS ----------------------

  const clearErrors = () => {
    if (validationError) setValidationError('');
    if (saveError) reset();
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, documentType: value }));
    clearErrors();
  };

  const handleFileSelect = (file) => {
    clearErrors();
    // null: la zona de carga rechazó el archivo y ya muestra su propio mensaje.
    if (!file) {
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }
    const fileError = getFileError(file);
    setFormData((prev) => ({ ...prev, file: fileError ? null : file }));
    if (fileError) setValidationError(fileError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // ---------------------- VALIDATIONS ----------------------
    const documentType = Number(formData.documentType);
    const errors = [];
    if (!documentType) {
      errors.push('Selecciona el tipo de documento.');
    } else if (usedTypes.includes(documentType)) {
      errors.push('Ya tienes un documento de este tipo; elimínalo para subir uno nuevo.');
    }
    const fileError = getFileError(formData.file);
    if (fileError) errors.push(fileError);

    if (errors.length > 0) {
      setValidationError(errors.join(' '));
      return;
    }

    const payload = new FormData();
    payload.append('document_type', String(documentType));
    payload.append('file', formData.file);

    const response = await createDocument(internshipId, payload);
    if (!response) return; // el error del backend se muestra en el formulario

    setFormData(INITIAL_FORM);
    setDropzoneKey((key) => key + 1);
    onSuccess?.(response.data);
  };

// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit} noValidate>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {validationError || saveError}
          </span>
        </div>
      )}

      <div className="flex flex-col mt-6 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="documentType" className="form-label">
            Tipo de documento
          </label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleTypeChange}
            className="form-input_full"
            disabled={saving}
          >
            <option value="">Selecciona un tipo</option>
            {DOCUMENT_TYPE_OPTIONS.map((type) => {
              const used = usedTypes.includes(type);
              return (
                <option key={type} value={type} disabled={used}>
                  {DOCUMENT_TYPE_LABELS[type]}{used ? ' (ya subido)' : ''}
                </option>
              );
            })}
          </select>
          <p className="text-xs text-gray-500">
            Solo puede haber un documento de cada tipo. Para reemplazarlo, elimina el actual y sube el nuevo.
          </p>
        </div>

        <FileDropzone
          key={dropzoneKey}
          label={formData.file?.name ?? 'Haz clic para seleccionar o arrastra tu archivo'}
          sublabel={
            formData.file
              ? `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB`
              : `Solo archivos PDF, máximo ${MAX_FILE_MB} MB`
          }
          acceptedFormats="application/pdf,.pdf"
          maxSizeMB={MAX_FILE_MB}
          onFileSelect={handleFileSelect}
          disabled={saving}
        />

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Subiendo...' : 'Subir documento'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default DocumentForm;
