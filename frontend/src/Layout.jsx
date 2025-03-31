import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function Layout({ user, children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
    console.log("Sidebar Visible:", !sidebarVisible); // Verificar si cambia
  };

  return (
    <div>
      <Navbar 
        image={user.profile_photo} 
        user={user}>
        {user.first_name} {user.last_name} {user.second_last_name}
      </Navbar>
    
    <div className="layout flex">
      {sidebarVisible && (
        <div className="sidebar-container">
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
      )}
    </div>

      <div className="p-4 sm:ml-64">
        <div className="p-1 border-2 h-screen border-gray-200 border-dashed rounded-lg dark:border-gray-700 p-4">
        </div>
      </div>      
    </div>

  );
}

export default Layout;

