function PageLayout({ title, actions, pretitle = 'Ir atrás', children }) {
  const hasHeader = Boolean(title || pretitle || actions);

  return (
    <div
      className={`flex flex-col my-4 mx-8 max-w-full min-w-0 ${
        hasHeader ? "gap-16" : ""
      }`}
    >
      {hasHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
          <div className="flex-col min-w-0">
            {pretitle && (
              <div className="flex items-start">
                <button
                  onClick={() => window.history.back()}
                  className="btn-tertiary--light text-sm"
                >
                  {pretitle}
                </button>
              </div>
            )}

            {title && (
              <h2 className="font-bold text-gray-900 text-3xl tracking-tight truncate">
                {title}
              </h2>
            )}
          </div>

          {actions && 
            <div className="flex items-end">
              {actions}
            </div>
          }
        </div>
      )}

      <div className="w-full min-w-0 max-w-full pb-32 overflow-x-hidden overflow-y-visible">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
