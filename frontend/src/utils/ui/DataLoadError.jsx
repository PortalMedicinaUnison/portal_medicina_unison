import React from 'react';

function DataLoadError({
  title = 'No se pudieron cargar los datos',
  titleClassName,
  message = 'Ocurrió un problema al obtener la información.',
  onRetry,                 // opcional: () => void
  retryLabel = 'Reintentar',
  onSecondary,             // opcional: () => void (por ejemplo, ir a inicio o volver)
  secondaryLabel = 'Volver',
}) {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh] h-full"
      role="alert"
      aria-live="polite"
    >
      <div className="grid place-items-center w-full">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">ERROR</p>
          <h1 className={`text-3xl font-bold tracking-tight text-balance text-gray-900 ${titleClassName}`}>

            {title}
          </h1>
          <p className="mt-4 text-base font-light text-pretty text-gray-500">
            {message}
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-3">
            {onRetry && (
              <button 
                type="button" 
                className="btn-primary" 
                onClick={onRetry}
              >
                {retryLabel}
              </button>
            )}
            {onSecondary && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onSecondary}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataLoadError;
