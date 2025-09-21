import { useState } from 'react';
import useAuth from '../../features/auth/hooks/useAuth';
import { ROUTES, userAbs } from '../../config';
import { Link, NavLink } from 'react-router-dom';


function Sidebar({ toggleSidebar, openToggleButton }) {
    const { logout, authenticated } = useAuth();

    const [openInternshipDropdown, setOpenInternshipDropdown] = useState(false);
    const [openSocialServiceDropdown, setOpenSocialServiceDropdown] = useState(false);

    const toggleInternshipDropdown = () => {
        setOpenInternshipDropdown(!openInternshipDropdown);
    };
    
    const toggleSocialServiceDropdown = () => {
        setOpenSocialServiceDropdown(!openSocialServiceDropdown);
    };

    return (
        <div id="sidebar">
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                        <Link to={ROUTES.HOME} className="ms-5 md:me-15">
                            <img src="/unison-letters.svg" className="h-8 me-3" alt="unison logo" />
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
                <div className="sidebar footer">
                    <div className="space-y-1">

                        {/************************ GENERAL ************************/}
                        <div>
                            <p className="sidebar-section-title">
                                General
                            </p>
                        </div>
                        <div>
                            <NavLink to={ROUTES.HOME} className={({ isActive }) => isActive ? "sidebar-item-group group text-indigo-900" : "sidebar-item-group group"}>
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
                            <Link to={ROUTES.USER.REPORTS_LIST} className="sidebar-item-group group">
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
                                    Reportes
                                </span>
                            </Link>
                        </div>

                        {/************************ INTERNADO ************************/}
                        <div>
                            <p className="sidebar-section-title border-t">
                                Internado
                            </p>
                        </div>
                        <div>
                            <Link to="#" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3.5 5.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.497a2 2 0 0 0-1.85-1.994l-.15-.005l-5 .002l-2-2h-4a1 1 0 0 0-1 1m0 1h7"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Internado
                                </span>
                            </Link>
                        </div>
                        
                        {/******** INTERNADO DROPDOWN ********/}
                        <div className={`${openInternshipDropdown ? 'block' : 'hidden'}`}>
                            <Link to="#" className="sidebar-item-link">
                                Mi Internado
                            </Link>
                        </div>

                        <div>
                            <Link to="https://medicina.unison.mx/internado-de-pregrado/" target="_blank" rel="noopener noreferrer" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-3 -3 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="8.5" cy="8.5" r="8" fill="none"/>
                                    <path d="M8.5 12.5v-4h-1m0 4h2"/>
                                    <circle cx="8.5" cy="5.5" r="1"/>
                                </svg>
                                <span className="sidebar-item-text">
                                    Pagina Internado
                                </span>
                            </Link>
                        </div>
                        <div>
                            <Link to={ROUTES.ADMIN.SITE_LIST} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-3 -3 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6.5 16.54l.631-.711Q8.205 14.6 9.064 13.49l.473-.624Q12.5 8.875 12.5 6.533C12.5 3.201 9.814.5 6.5.5s-6 2.701-6 6.033q0 2.342 2.963 6.334l.473.624a55 55 0 0 0 2.564 3.05"/>
                                    <circle cx="6.5" cy="6.5" r="2.5"/>
                                </svg>
                                <span className="sidebar-item-text">
                                    Instituciones
                                </span>
                            </Link>
                        </div>
                    </div>


                    <div>
                        <ul>
                            <li>
                                <a href="#" className="sidebar-item-group group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon"
                                        viewBox="-3 -3 23 23"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="8.5" cy="8.5" r="8"/>
                                        <path d="M8.5 9.5v-1l1.414-1.414a2 2 0 0 0 .586-1.414V5.5c0-.613-.346-1.173-.894-1.447l-.212-.106a2 2 0 0 0-1.788 0L7.5 4c-.613.306-1 .933-1 1.618V6.5"/>
                                        <circle cx="8.5" cy="12.5" r="1"/>
                                    </svg>                        
                                    <span className="sidebar-item-text">
                                        Preguntas frecuentes
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="https://medicina.unison.mx/" className="sidebar-item-group group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon"
                                        viewBox="-3 -3 23 23"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="8.5" cy="8.5" r="8" fill="none"/>
                                        <path d="M8.5 12.5v-4h-1m0 4h2"/>
                                        <circle cx="8.5" cy="5.5" r="1"/>
                                    </svg>
                                    <span className="sidebar-item-text">
                                        Página Medicina Unison
                                    </span>
                                </a>
                            </li>
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
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
