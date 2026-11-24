// Igual que MAX_UPLOAD_MB del backend (documentos del expediente y formatos descargables).
export const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const PDF_MEDIA_TYPE = 'application/pdf';

// Algunos sistemas no informan el tipo del archivo; en ese caso se revisa la extensión.
// El backend vuelve a comprobar el contenido.
const isPdf = (file) => file.type === PDF_MEDIA_TYPE || /\.pdf$/i.test(file.name);

export function getPdfError(file) {
  if (!file) return 'Selecciona un archivo PDF.';
  if (!isPdf(file)) return 'El archivo debe ser un PDF.';
  if (file.size === 0) return 'El archivo está vacío.';
  if (file.size > MAX_FILE_BYTES) return `El archivo supera el tamaño máximo de ${MAX_FILE_MB} MB.`;
  return '';
}

export const TEMPLATE_ACCEPT = '.pdf,.docx,.doc,.xlsx,.xls,.odt';
const TEMPLATE_EXTENSIONS = /\.(pdf|docx|doc|xlsx|xls|odt)$/i;

export function getTemplateError(file) {
  if (!file) return 'Selecciona un archivo.';
  if (!TEMPLATE_EXTENSIONS.test(file.name)) return 'El formato debe ser PDF, Word, Excel u OpenDocument.';
  if (file.size === 0) return 'El archivo está vacío.';
  if (file.size > MAX_FILE_BYTES) return `El archivo supera el tamaño máximo de ${MAX_FILE_MB} MB.`;
  return '';
}

// Evidencias de reportes: PDF o imágenes JPEG, PNG o WebP; hasta MAX_EVIDENCE_FILES por reporte.
export const MAX_EVIDENCE_FILES = 5;
export const EVIDENCE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp';
const EVIDENCE_TYPES = /^(application\/pdf|image\/(jpeg|png|webp))$/;
const EVIDENCE_EXTENSIONS = /\.(pdf|jpe?g|png|webp)$/i;

export function getEvidenceError(file) {
  if (!file) return 'Selecciona un archivo.';
  if (!EVIDENCE_TYPES.test(file.type) && !EVIDENCE_EXTENSIONS.test(file.name)) {
    return `"${file.name}" no es un PDF ni una imagen JPG, PNG o WebP.`;
  }
  if (file.size === 0) return `"${file.name}" está vacío.`;
  if (file.size > MAX_FILE_BYTES) return `"${file.name}" supera el tamaño máximo de ${MAX_FILE_MB} MB.`;
  return '';
}

export function formatFileSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function pdfDownloadName(doc) {
  const name = doc.original_filename?.trim();
  if (!name) return `documento_${doc.document_id}.pdf`;
  return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
}
