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

export function pdfDownloadName(doc) {
  const name = doc.original_filename?.trim();
  if (!name) return `documento_${doc.document_id}.pdf`;
  return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
}
