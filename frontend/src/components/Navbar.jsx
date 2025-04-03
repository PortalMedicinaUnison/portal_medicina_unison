import '../styles.css';


function Navbar({ user }) {

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center px-1.5 justify-start rtl:justify-end">
                        <button id="show-sidebar-button" className="show-sidebar-button" onClick={showSidebar}>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <a href="/inicio" className="ms-5 md:me-15">
                            {/* <span className="self-center font-semibold sm:text-xl  whitespace-nowrap">Portal de Medina Unison</span> */}
                            <img src="unison-letters.svg" class="h-8 me-3" alt="unison logo" />
                        </a>
                    </div>

                <div className="flex items-center justify-end">
                    <button type="button" className="flex px-3" aria-expanded="false">
                        <span className="text-xs font-semibold text-gray-900">{user.first_name} {user.last_name}</span>
                    </button>

                    <button type="button" className="rounded-full focus:ring-0 focus:ring-gray-200 focus:ring-offset-1 focus:ring-offset-gray-200" aria-expanded="false">
                        <img src={`/default-avatar.png`} alt="User Photo" className="size-10 rounded-full"/>
                        {/* <img src={user.profile_photo || `/default-avatar.png`} alt="User Photo" className="size-12 rounded-full"/> */}
                    </button>
                </div>
                </div>
        </nav>
    );
}

export default Navbar;
