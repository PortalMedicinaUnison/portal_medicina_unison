import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PageHeadings from './components/PageHeadings';
import { useUser } from './contexts/UserContext';


function Layout({ children }) {
  const { user } = useUser();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
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

      <div className="main-container">
        <div className="main-content">
          {children}
        </div>
      </div>      
    </div>
  );
}

export default Layout;

