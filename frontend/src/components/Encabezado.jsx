import '../styles.css';


function Encabezado({children, image}) {

    function showSidebar(){
        const sidebar = document.getElementById("sidebar");
        sidebar.style.width = 'var(--sidebar-width)';
        // sidebar.style.transform = 'translateX(0%)';
        const showButton = document.getElementById("show-sidebar-button");
        showButton.style.display = 'none';
        const header = document.getElementById("header");
        header.style.justifyContent = 'flex-end';
    }

    return (        
        <nav className="navbar">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between border">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button id="show-sidebar-button" className="show-sidebar-button border" onClick={showSidebar}>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <a href="/inicio" className="flex ms-2 md:me-24 border">
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap border">Portal de Medina Unison</span>
                        </a>
                    </div>
                
                    <div className="flex items-center border">
                        <button type="button" className="relative flex rounded-full text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-expanded="false">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <span className="text-base">{children}</span>
                            <img src={image || `/default-avatar.png`} alt="User Photo" className="size-12 rounded-full"/>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Encabezado;
