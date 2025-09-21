import { useState } from 'react';
import { useUser } from './contexts/UserContext';
import LoadingSpinner from './utils/ui/LoadingSpinner';

import StudentSidebar from './user/components/StudentSidebar';
import AdminSidebar from './admin/components/AdminSidebar';
import Navbar from './components/Navbar';


function Layout({ children }) {
  const { userRole, loading, error } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  let Sidebar;
  if (userRole === 'admin') {
    Sidebar = AdminSidebar;
  } else {
    Sidebar = StudentSidebar;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full">
      <div id="sidebar-container" className={`sidebar-container ${isSidebarOpen ? 'w-56 translate-x-0' : 'w-0 -translate-x-56'}`}>
        <Sidebar toggleSidebar={toggleSidebar} openToggleButton={isSidebarOpen} />
      </div>

      <div id="main-container" className={`main-container ${!isSidebarOpen ? 'w-screen' : 'w-[calc(100vw-14rem)]'}`}>
        <Navbar toggleSidebar={toggleSidebar} openToggleButton={!isSidebarOpen} />
        <div id="main-content" className="main-content">
          {children}
        </div>
      </div>      
    </div>
  );
}

export default Layout;