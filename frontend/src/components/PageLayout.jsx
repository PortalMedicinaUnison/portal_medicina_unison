
function PageLayout({ title, actions, pretitle = "Ir atrás", children }) {

  return (
     <div className="flex flex-col gap-16 my-4 mb-16 mx-8 max-w-full min-w-0 ">
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
          <h2 className="font-bold text-gray-900 text-3xl tracking-tight truncate">
            {title}
          </h2>
        </div>
        
        {actions && (
          <div className="flex items-end">
            {actions}
          </div>
        )}
      </div>
      
      <div className="w-full min-w-0 max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;