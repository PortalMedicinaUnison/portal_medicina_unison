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

  const Sidebar = userRole === 'admin' ? AdminSidebar : StudentSidebar;
  
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const closeMobileSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden ">
      <aside
        className={[
          "hidden md:block",
          "relative z-20 h-full shrink-0",
          "transition-all duration-300 ease-in-out overflow-hidden",
          isSidebarOpen ? "w-56" : "w-0"
        ].join(' ')}
        aria-label="Barra lateral"
        aria-expanded={isSidebarOpen}
      >
        {/* Render del componente pasado */}
        <div className="h-full">
          <Sidebar toggleSidebar={toggleSidebar} openToggleButton={isSidebarOpen} />
        </div>
      </aside>

      {/* ===== Mobile overlay + drawer (< md) ===== */}
      {/* Overlay para cerrar tocando fuera */}
      <div
        className={[
          "fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ].join(' ')}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      {/* Drawer móvil */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-56 shadow-lg md:hidden",
          "transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <Sidebar toggleSidebar={toggleSidebar} openToggleButton={isSidebarOpen} />
      </aside>

      <div className="relative z-0 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 shrink-0">
          <Navbar toggleSidebar={toggleSidebar} openToggleButton={!isSidebarOpen} />
        </header>

        <main
          id="main"
          className="relative flex-1 overflow-x-hidden overflow-y-auto min-h-0"
        >
          <div id="thread" className="h-full w-full max-w-full min-w-0">
            <div className="h-full w-full min-w-0 text-sm/6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;