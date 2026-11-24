/**
 * Aviso para el estudiante que todavía no tiene asignación de servicio social. Es lo normal mientras
 * cursa el internado (la coordinación la hace después de que lo acredita), así que no se muestra como error.
 *
 * Props:
 * - onReload?: () => void  vuelve a consultar la asignación
 */
function NoSocialServiceApplication({ onReload }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[40vh] text-center">
      <h3 className="text-xl font-semibold text-gray-900">Aún no tienes una asignación de servicio social</h3>
      <p className="max-w-md text-gray-500">
        El servicio social se asigna después de acreditar el internado. Cuando la coordinación te asigne
        a una promoción de servicio social podrás aceptarla o declinarla en esta sección.
      </p>
      {onReload && (
        <button type="button" className="btn-secondary" onClick={onReload}>
          Recargar
        </button>
      )}
    </div>
  );
}

export default NoSocialServiceApplication;
