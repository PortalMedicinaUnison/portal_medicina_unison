import { useMemo } from "react";
import { useNavigate } from "react-router-dom";


function PageLayout({ title, actions, pretitle = "Ir atrás", children }) {

  return (
     <div className="flex flex-col gap-16 my-4 mb-16 mx-8 max-w-full min-w-0">
      <div className="lg:flex lg:justify-between lg:gap-24 max-w-full">
        <div className="min-w-0 flex-1 max-w-full">
          {pretitle && (
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <button
                onClick={() => window.history.back()}
                className="btn-tertiary--light text-xs"
              >
                {pretitle}
              </button>
            </div>
          )}
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:text-3xl sm:tracking-tight max-w-full truncate">
            {title}
          </h2>
        </div>
        
        {actions && (
          <div className="flex lg:mt-0 lg:ml-4 items-end min-w-0">
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