import { useState } from 'react';
import { useUser } from './contexts/UserContext';
import StudentSidebar from './user/components/StudentSidebar';
import AdminSidebar from './admin/components/AdminSidebar';
import Navbar from './components/Navbar';


function Layout({ children }) {
  const { userRole } = useUser();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [expandMainContainer, setExpandMainContainer] = useState(false);
  const [openHideButton, setOpenHideButton] = useState(true);
  const [openShowButton, setOpenShowButton] = useState(false);

  let Sidebar;
  if (userRole === 'admin') {
    Sidebar = AdminSidebar;
  } else {
    Sidebar = StudentSidebar;
  }

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

