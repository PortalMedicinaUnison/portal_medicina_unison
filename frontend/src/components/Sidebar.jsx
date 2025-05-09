import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../features/auth/hooks/useAuth'; // Adjust the import path if necessary
import { ROUTES } from '../config';


function Sidebar({ toggleSidebar }) {
    const { logout, authenticated } = useAuth();

    return (
        <div>
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                    <div className="flex w-full items-center justify-between">
                        <a href={ROUTES.HOME} className="ms-5 md:me-15">
                            {/* <span className="self-center font-semibold sm:text-xl  whitespace-nowrap">Portal de Medina Unison</span> */}
                            <img src="unison-letters.svg" class="h-8 me-3" alt="unison logo" />
                        </a>
                    </div>
                </div>
                <div className="sidebar footer">
                    <ul className="space-y-1">
                        <p className="text-gray-600 text-xs px-1">
                            General
                        </p>
                        <li>
                            <a href="#" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m1.5 10.5l9-9l9 9"/>
                                    <path d="M3.5 8.5v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
                                </svg>                        
                                <span className="sidebar-item-text">Inicio</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1"/>
                                </svg>                        
                                <span className="sidebar-item-text">Reportes</span>
                            </a>
                        </li>

                        {/* <div className="px-1 border-b py-1"></div>
                        <p className="text-gray-400 text-xs py-2">
                            Internado
                        </p> */}

                        <li mb-2>
                            <p className="text-gray-600 text-xs px-1 mt-4 py-2 border-t">
                                Internado
                            </p>
                        </li>

                        <li>
                            <button type="button" className="sidebar-item-group group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M3.5 5.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.497a2 2 0 0 0-1.85-1.994l-.15-.005l-5 .002l-2-2h-4a1 1 0 0 0-1 1m0 1h7"/>
                                </svg>                        
                                <span className="sidebar-item-text">Internado</span>
                            <svg sidebar-toggle-item className="sidebar-toggle-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Products</a>
                                </li>
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Billing</a>
                                </li>
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Invoice</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                                <a href="https://medicina.unison.mx/internado-de-pregrado/" target="_blank" rel="noopener noreferrer" className="sidebar-item-group group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon"
                                        viewBox="-3 -3 23 23"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="8.5" cy="8.5" r="8" fill="none"/>
                                        <path d="M8.5 12.5v-4h-1m0 4h2"/>
                                        <circle cx="8.5" cy="5.5" r="1"/>
                                    </svg>
                                    <span className="sidebar-item-text">Pagina Internado</span>
                                </a>
                            </li>
                        

                        <li mb-2>
                            <p className="text-gray-600 text-xs px-1 mt-4 py-2 border-t">
                                Servicio social
                            </p>
                        </li>

                        <li>
                        <button type="button" className="sidebar-item-group group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M3.5 5.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.497a2 2 0 0 0-1.85-1.994l-.15-.005l-5 .002l-2-2h-4a1 1 0 0 0-1 1m0 1h7"/>
                                </svg>                        
                                <span className="sidebar-item-text">Servicio social</span>
                            <svg sidebar-toggle-item className="sidebar-toggle-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Products</a>
                                </li>
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Billing</a>
                                </li>
                                <li>
                                    <a href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">Invoice</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="https://medicina.unison.mx/servicio-social/" target="_blank" rel="noopener noreferrer" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-3 -3 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="8.5" cy="8.5" r="8" fill="none"/>
                                    <path d="M8.5 12.5v-4h-1m0 4h2"/>
                                    <circle cx="8.5" cy="5.5" r="1"/>
                                </svg>
                                <span className="sidebar-item-text">Pagina Servicio Social</span>
                            </a>
                        </li>
                    </ul>


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
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="8.5" cy="8.5" r="8"/>
                                        <path d="M8.5 9.5v-1l1.414-1.414a2 2 0 0 0 .586-1.414V5.5c0-.613-.346-1.173-.894-1.447l-.212-.106a2 2 0 0 0-1.788 0L7.5 4c-.613.306-1 .933-1 1.618V6.5"/>
                                        <circle cx="8.5" cy="12.5" r="1"/>
                                    </svg>                        
                                    <span className="sidebar-item-text">Preguntas frecuentes</span>
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
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="8.5" cy="8.5" r="8" fill="none"/>
                                        <path d="M8.5 12.5v-4h-1m0 4h2"/>
                                        <circle cx="8.5" cy="5.5" r="1"/>
                                    </svg>
                                    <span className="sidebar-item-text">Página Medicina Unison</span>
                                </a>
                            </li>
                            <li>
                                <Link to={ROUTES.AUTH.LOGOUT} className="sidebar-item-group group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon group-hover:text-red-700"
                                        viewBox="0 0 23 23"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="m7.405 13.5l-2.905-3l2.905-3m-2.905 3h9m-6-7l8 .002c1.104.001 2 .896 2 2v9.995a2 2 0 0 1-2 2l-8 .003"/>
                                    </svg>
                                    <span className="sidebar-item-text group-hover:text-red-700">Cerrar sesión</span>
                                </Link>
                            </li>
                        </ul>
                    </div>         
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
