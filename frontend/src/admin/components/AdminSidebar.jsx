import { Link, NavLink } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../config';
import useAuth from '../../features/auth/hooks/useAuth';
import SidebarCollapse from '../../utils/ui/CollapseMenu';


function Sidebar({ toggleSidebar, openToggleButton }) {
    const { logout, authenticated } = useAuth();

    return (
        <div id="sidebar">
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                        <Link to={ROUTES.HOME} className="ms-5 md:me-15">
                            <img src="../../unison-letters.svg" className="h-8 me-3" alt="unison logo" />
                        </Link>
                        <button className={`${openToggleButton ? 'block' : 'hidden'}`} onClick={toggleSidebar}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="sidebar-item-icon"
                                viewBox="-1 -1 23 23"
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4.5 6.5h12m-12.002 4h11.997M4.5 14.5h11.995"/>
                            </svg>
                        </button>
                </div>
                <div className="sidebar-body">
                    <div className="space-y-1">

                        {/************************ GENERAL ************************/}
                        <div>
                            <p className="sidebar-section-title">
                                General
                            </p>
                        </div>
                        <div>
                            <NavLink to={ROUTES.HOME} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m1.5 10.5l9-9l9 9"/>
                                    <path d="M3.5 8.5v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Inicio
                                </span>
                            </NavLink>
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Alumnos"
                                links={[
                                    { label: 'Lista de alumnos', to: adminAbs(ROUTES.ADMIN.USER_LIST), className: 'sidebar-item-link' },
                                    { label: 'Pre-registro', to: adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_LIST), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
                                    </svg>
                                }
                            />
                        </div>

                        {/************************ INTERNADO ************************/}
                        <div>
                            <p className="sidebar-section-title border-t">
                                Internado
                            </p>
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.PROMOTION_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Promociones
                                </span>
                            </Link>
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.PROMOTION_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Internados
                                </span>
                            </Link>
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Sedes"
                                links={[
                                    { label: 'Sedes', to: adminAbs(ROUTES.ADMIN.SITE_LIST), className: 'sidebar-item-link' },
                                    { label: 'Instituciones', to: adminAbs(ROUTES.ADMIN.INSTITUTION_LIST), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 21.325q-.35 0-.7-.125t-.625-.375Q9.05 19.325 7.8 17.9t-2.087-2.762t-1.275-2.575T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 1.125-.437 2.363t-1.275 2.575T16.2 17.9t-2.875 2.925q-.275.25-.625.375t-.7.125M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12"/>
                                    </svg>
                                }
                            />
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.REPORT_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M16.5 3.5h-12a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1z"/>
                                    <path d="M7.5 7.5h6"/>
                                    <path d="M7.5 10.5h6"/>
                                    <path d="M7.5 13.5h3"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Reportes
                                </span>
                            </Link>
                        </div>

                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Avisos
                                </span>
                            </Link>
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.SURVEY_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Encuestas
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/************************ INTERNADO ************************/}

                <div className="sidebar-footer">
                    <ul>
                        <li>
                            <button
                                onClick={logout}
                                className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon group-hover:text-red-700"
                                    viewBox="0 0 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m7.405 13.5l-2.905-3l2.905-3m-2.905 3h9m-6-7l8 .002c1.104.001 2 .896 2 2v9.995a2 2 0 0 1-2 2l-8 .003"/>
                                </svg>
                                <span className="sidebar-item-text group-hover:text-red-700">
                                    Cerrar sesión
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>         
            </aside>
        </div>
    );
}

export default Sidebar;
