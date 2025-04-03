
function Sidebar({ toggleSidebar }) {
    return (
        <div>
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                    <div className="flex w-full items-center justify-between">
                        <a href="/inicio" className="ms-5 md:me-15">
                            {/* <span className="self-center font-semibold sm:text-xl  whitespace-nowrap">Portal de Medina Unison</span> */}
                            <img src="unison-letters.svg" class="h-8 me-3" alt="unison logo" />
                        </a>
                    </div>
                </div>
                <div className="sidebar">
                    <ul className="space-y-1 font-medium">
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
                            <a href="#" className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="10.5" cy="10.5" r="8" fill="none"/>
                                    <path d="M10.5 11.5v-5"/>
                                    <circle cx="10.5" cy="14.5" r="1" fill="currentColor"/>
                                </svg>                        
                                <span className="sidebar-item-text">Reportes</span>
                            </a>
                        </li>                        
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
