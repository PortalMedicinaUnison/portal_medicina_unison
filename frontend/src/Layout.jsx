import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import fetchUser from './utils/utils';


function Layout() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
    console.log("Sidebar Visible:", !sidebarVisible); // Verificar si cambia
  };

  return (
    <div>
      <Navbar user={user}></Navbar>
    
    <div className="layout flex">
      {sidebarVisible && (
        <div className="sidebar-container">
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
      )}
    </div>

      <div className="p-2 sm:ml-64">
        <div className="border h-screen border-gray-300 border-dashed rounded-lg">
        </div>
      </div>      
    </div>

  );
}

export default Layout;

