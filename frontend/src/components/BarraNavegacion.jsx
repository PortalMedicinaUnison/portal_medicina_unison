function BarraNavegacion({ toggleSidebar }) {
    return (
        <div>
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >
                <div className="sidebar">
                    <ul className="space-y-3 font-medium">
                        <li>
                            <a href="#" className="sidebar-item-group border">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon border"
                                    viewBox="2 2 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M9 13h6v6h3v-9l-6-4.5L6 10v9h3zm-5 8V9l8-6l8 6v12z"/>
                                </svg>                        
                                <span className="sidebar-item-text border">Inicio</span>
                            </a>
                        </li>

                        <li>
                            <button type="button" className="group-icon group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white border" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                            <span className="flex-1 ml-3 text-left whitespace-nowrap text-black border" sidebar-toggle-item>Internado</span>
                            <svg sidebar-toggle-item className="w-6 h-6 border" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
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
                            <button type="button" className="group-icon group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white border" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                            <span className="flex-1 ml-3 text-left whitespace-nowrap text-black border" sidebar-toggle-item>Servicio social</span>
                            <svg sidebar-toggle-item className="w-6 h-6 border" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
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
                            <a href="#" className="sidebar-item-group">
                                <svg 
                                    className="sidebar-item-icon" 
                                    aria-hidden="true" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9 13h6v6h3v-9l-6-4.5L6 10v9h3zm-5 8V9l8-6l8 6v12z"/>
                                </svg>
                                <span className="sidebar-item-text">Inbox</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <svg 
                                    className="sidebar-item-icon" 
                                    aria-hidden="true" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 18"
                                >
                                    <path d="M9 13h6v6h3v-9l-6-4.5L6 10v9h3zm-5 8V9l8-6l8 6v12z"/>
                                </svg>
                                <span className="sidebar-item-text">Users</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default BarraNavegacion;
