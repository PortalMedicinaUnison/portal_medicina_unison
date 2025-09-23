/**
 * Contenido de confirmación reutilizable para colocar dentro de tu <Modal>.
 *
 * Props:
 * - title?: string (opcional)
 * - message: string | ReactNode (mensaje principal)
 * - icon?: ReactNode (ícono opcional)
 * - onConfirm: () => void | Promise<void> (se ejecuta cuando el usuario confirma)
 * - onCancel: () => void | Promise<void> (se ejecuta cuando el usuario cancela)
 * - primaryLabel?: string (etiqueta del botón de confirmación)
 * - secondaryLabel?: string (etiqueta del botón de cancelación)
 * - danger?: boolean (aplica estilo rojo al botón primario)
 */
export default function ConfirmDialogContent({
  title,
  message = "Esta acción no se puede deshacer. ¿Deseas continuar?",
  icon,
  onConfirm,
  onCancel,
  primaryLabel = "Confirmar",
  secondaryLabel = "Cancelar",
  danger = false,
}) {
  
  const handleConfirm = () => onConfirm?.();
  const handleCancel = () => onCancel?.();

  return (
    <div className="flex w-full justify-center items-center">
      <div className="w-full">
        {/* Icono */}
        <div className="grid place-items-center mb-4">
          {icon ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gray"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="8" />
              <path d="M10.5 11.5v-5" />
              <circle cx="10.5" cy="14.5" r="1" />
            </svg>
          )}
        </div>

        {/* Título opcional */}
        {title && <h4 className="text-center text-base font-medium mb-2">{title}</h4>}

        {/* Mensaje */}
        <div className="text-center mb-6">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

        {/* Acciones */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            className={`btn-primary_full ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {primaryLabel}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary_full"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
