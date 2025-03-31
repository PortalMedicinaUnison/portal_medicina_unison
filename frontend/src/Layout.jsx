import React, { useState } from 'react';
import BarraNavegacion from './components/BarraNavegacion';
import Encabezado from './components/Encabezado';
import ContenidoPrincipal from './components/ContenidoPrincipal';

function Layout({ user, children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
    console.log("Sidebar Visible:", !sidebarVisible); // Verificar si cambia
  };

  return (
    <div className="layout flex">
      {sidebarVisible && (
        <div className="sidebar-container">
          <BarraNavegacion toggleSidebar={toggleSidebar} />
        </div>
      )}
      <div className="main-section flex flex-col w-full">
        <Encabezado 
          image={user.profile_photo} 
          toggleSidebar={toggleSidebar} 
          sidebarVisible={sidebarVisible}
        >
          {user.first_name} {user.last_name} {user.second_last_name}
        </Encabezado>
        <ContenidoPrincipal user={user}>
          {children}
        </ContenidoPrincipal>
      </div>
    </div>
  );
}

export default Layout;

