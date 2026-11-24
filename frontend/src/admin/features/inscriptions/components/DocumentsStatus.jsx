import { documentsState } from '../programs';

// Estado de los documentos obligatorios de inscripción en una fila o ficha.
function DocumentsStatus({ progress }) {
  const state = documentsState(progress);
  if (state === 'none') return <span className="text-gray-400">—</span>;
  if (state === 'complete') return <span className="font-medium text-green-700">Completos</span>;
  return (
    <span className={state === 'review' ? 'text-amber-700' : 'text-gray-700'}
      title={`${progress.approved} de ${progress.required} obligatorios aprobados; ${progress.submitted} subidos`}>
      {progress.approved}/{progress.required} aprobados
      <span className="block text-xs text-gray-500">{state === 'review' ? 'Por revisar' : 'Faltan por subir'}</span>
    </span>
  );
}

export default DocumentsStatus;
