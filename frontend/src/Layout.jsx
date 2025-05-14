import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar-container");
    const noSidebar = document.getElementById("no-sidebar-container");
    const showButton = document.getElementById("show-sidebar-button");
    const hideButton = document.getElementById("hide-sidebar-button");

    if(sidebarVisible){
        noSidebar.style.width = '100vw';
        sidebar.style.width = '0';
        sidebar.style.transform = 'translateX(-14rem)';
        showButton.style.display = 'block';
        hideButton.style.display = 'none';
      }else{
        noSidebar.style.width = 'calc(100vw - 14rem)';
        sidebar.style.width = '14rem';
        sidebar.style.transform = 'translateX(0rem)';
        showButton.style.display = 'none';
        hideButton.style.display = 'block';
    }
    setSidebarVisible(prev => !prev);
  };

  return (
    <div className="flex justify-between">
      <div id="sidebar-container" className="sidebar-container">
        <Sidebar toggleSidebar={toggleSidebar}/>
      </div>
      <div id="no-sidebar-container" className="no-sidebar-container">
        <Navbar toggleSidebar={toggleSidebar}/>
        <div id="main-container" className="main-container">
          <div id="main-content" className="main-content">
            {children}
          </div>
        </div>      
      </div>
    </div>
  );
}

export default Layout;

