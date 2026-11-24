import { useRef, useState } from 'react';
import useBulkCreateEnrollments from '../hooks/useBulkCreateEnrollments';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';


// Límite del backend (POST /enrollments/bulk acepta hasta 2000 expedientes).
const MAX_ACADEMIC_IDS = 2000;
const MAX_FILE_SIZE_MB = 2;

const SUMMARY_SECTIONS = [
  { key: 'created', label: 'Pre-registrados' },
  { key: 'skipped', label: 'Omitidos (ya estaban pre-registrados)' },
  { key: 'invalid', label: 'Inválidos (deben empezar con 2)' },
];

// Extrae los expedientes de un CSV/TXT: separa por saltos de línea, comas, punto y coma o espacios,
// quita comillas y conserva solo valores de 9 dígitos (encabezados, nombres, etc. se ignoran).
function parseAcademicIds(text) {
  const tokens = String(text)
    .split(/[\s,;]+/)
    .map((token) => token.trim().replace(/^["']+|["']+$/g, ''))
    .filter((token) => /^\d{9}$/.test(token));
  return [...new Set(tokens)];
}

function ImportSummary({ foundCount, result }) {
  return (
    <div className="space-y-4 text-left">
      <p>Expedientes encontrados en el archivo: <strong>{foundCount}</strong></p>
      {SUMMARY_SECTIONS.map(({ key, label }) => {
        const academicIds = result?.[key] ?? [];
        return (
          <div key={key}>
            <p className="font-semibold">{label}: {academicIds.length}</p>
            {academicIds.length > 0 && (
              <p className="mt-1 max-h-24 overflow-y-auto break-words text-gray-600">
                {academicIds.join(', ')}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Botón "Importar desde CSV": lee el archivo en el navegador, envía los expedientes al backend
// y muestra el resumen. `onImported(result)` se llama cuando la importación termina bien.
function EnrollmentCsvImport({ onImported, label = 'Importar desde CSV', className = 'item-link', disabled = false }) {
  const inputRef = useRef(null);
  const { bulkCreateEnrollments, loading: importing, error: importError, result, reset } = useBulkCreateEnrollments();

  const [fileError, setFileError] = useState('');
  const [foundCount, setFoundCount] = useState(0);

  const dialogError = fileError || importError;
  const showDialog = Boolean(dialogError || result);

// ---------------------- HANDLERS ----------------------

  const handleButtonClick = () => inputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    reset();
    setFileError('');

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`El archivo excede el tamaño máximo de ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    let text;
    try {
      text = await file.text();
    } catch {
      setFileError('No se pudo leer el archivo.');
      return;
    }

    const academicIds = parseAcademicIds(text);
    if (academicIds.length === 0) {
      setFileError('No se encontraron expedientes (9 dígitos) en el archivo.');
      return;
    }
    if (academicIds.length > MAX_ACADEMIC_IDS) {
      setFileError(`El archivo tiene ${academicIds.length} expedientes; el máximo por importación es ${MAX_ACADEMIC_IDS}.`);
      return;
    }

    setFoundCount(academicIds.length);
    const summary = await bulkCreateEnrollments(academicIds);
    if (summary) onImported?.(summary);
  };

  const handleCloseDialog = () => {
    setFileError('');
    reset();
  };

// ---------------------- RENDER ----------------------

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleButtonClick}
        disabled={disabled || importing}
      >
        {importing ? 'Importando...' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />

      <Modal open={showDialog} onClose={handleCloseDialog}>
        <ConfirmDialogContent
          title={dialogError ? 'No se pudo importar el archivo' : 'Resultado de la importación'}
          message={dialogError || <ImportSummary foundCount={foundCount} result={result} />}
          onConfirm={handleCloseDialog}
          primaryLabel="Aceptar"
        />
      </Modal>
    </>
  );
}

export default EnrollmentCsvImport;
