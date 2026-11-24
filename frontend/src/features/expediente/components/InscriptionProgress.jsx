// Avance de los documentos obligatorios de inscripción (p. ej. "4/6" o "Completos").
function InscriptionProgress({ progress }) {
  if (!progress || progress.required === 0) return <span className="text-gray-400">—</span>;
  if (progress.complete) return <span className="font-medium text-green-700">Completos</span>;
  return (
    <span className="text-gray-700" title={`${progress.approved} de ${progress.required} obligatorios aprobados`}>
      {progress.approved}/{progress.required}
    </span>
  );
}

export default InscriptionProgress;
