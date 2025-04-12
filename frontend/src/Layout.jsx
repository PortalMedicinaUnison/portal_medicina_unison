import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <div>
      <Navbar />
      <div className="layout flex">
        {sidebarVisible && (
          <div className="sidebar-container">
            <Sidebar toggleSidebar={toggleSidebar} />
          </div>
        )}
      </div>

      <div className="main-container">
        <div className="main-content">
          {children}
        </div>
      </div>      
    </div>
  );
}

export default Layout;

