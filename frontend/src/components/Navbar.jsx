import '../styles.css';
import { useUser } from '../contexts/UserContext';

function Navbar() {
    const { user } = useUser();
    
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
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button id="show-sidebar-button" onClick={showSidebar}>
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
                                    <path d="M4.5 6.5h12m-12.002 4h11.997M4.5 14.5h11.995"/>
                                    
                                </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-end">
                        <button type="button" className="flex flex-col px-3 text-right" aria-expanded="false">
                            <span className="text-xs font-semibold text-gray-900">{user.first_name} {user.last_name}</span>
                            <span className="text-[10px] text-gray-900">{user.email}</span>
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
