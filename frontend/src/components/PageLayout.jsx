
function PageLayout({ title, actions, pretitle = "Ir atrás", children }) {
  return (
    <div className="component-container">
      <div className="component-container_header">
        <div className="component-container_header-content">
          {pretitle && (
            <div className="component-container_pretitle">
              <button
                onClick={() => window.history.back()}
                className="btn-tertiary--light text-xs"
              >
                {pretitle}
              </button>
            </div>
          )}
          <h2 className="page-title-1">
            {title}
          </h2>
        </div>
        
        {actions && (
          <div className="component-container_actions">
            {actions}
          </div>
        )}
      </div>
      
      <div className="content-container">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;