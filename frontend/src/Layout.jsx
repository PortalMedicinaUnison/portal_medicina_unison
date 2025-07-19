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
      setExpandMainContainer(!expandMainContainer);
      setOpenSidebar(!openSidebar);
      setOpenShowButton(!openShowButton);
      setOpenHideButton(!openHideButton);
    };

    return (
      <div className="flex justify-between">
        <div id="sidebar-container" className={`sidebar-container ${openSidebar ? 'w-56 translate-x-0' : 'w-0 -translate-x-56'}`}>
          <Sidebar toggleSidebar={toggleSidebar} openToggleButton={openHideButton} />
        </div>

        <div id="main-container" className={`main-container ${expandMainContainer ? 'w-screen' : 'w-[calc(100vw-14rem)]'}`}>
          <Navbar toggleSidebar={toggleSidebar} openToggleButton={openShowButton} />
          <div id="main-content" className="main-content">
            {children}
          </div>
        </div>      
      </div>
    );
  }

  export default Layout;