import React from 'react';

function PageLayout({ title, actions, pretitle = "Inicio", children }) {
  return (
    <div className="component-container">
      <div className="component-container_header">
        <div className="component-container_header-content">
          {pretitle && (
            <div className="component-container_pretitle">
              <p>{pretitle}</p>
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