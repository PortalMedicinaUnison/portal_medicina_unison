import { useState } from 'react';
import useAuth from '../../features/auth/hooks/useAuth';
import { ROUTES, adminAbs } from '../../config';
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
                            <Link to={adminAbs(ROUTES.ADMIN.SITE_LIST)} className="sidebar-item-group group">
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
                                    Sedes
                                </span>
                            </Link>
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.INSTITUTION_LIST)} className="sidebar-item-group group">
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
                                    Instituciones
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
                            <div onClick={toggleInternshipDropdown} className="sidebar-item-group group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
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
                                    Alumnos
                                </span>
                                <svg 
                                    className="sidebar-toggle-icon" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fillRule="evenodd" 
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                          clipRule="evenodd">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div className={`${openInternshipDropdown ? 'block' : 'hidden'}`}>
                            <Link to="#" className="sidebar-item-link">
                                Lista de alumnos   
                            </Link>
                            <Link to="#" className="sidebar-item-link">
                                Pre-registro
                            </Link>
                        </div>

                        <div>
                            <Link to="#" className="sidebar-item-group group">
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

                        <div>
                            <Link to="#" className="sidebar-item-group group">
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
                    </div>
                </div>
                

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
