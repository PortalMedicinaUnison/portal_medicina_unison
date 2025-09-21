import '../styles.css';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config';
import DropdownMenu from '../utils/ui/DropdownMenu';

function Navbar({ toggleSidebar, openToggleButton }) {
    const { user, loading } = useUser();

    return (        
        <nav className="top-0 h-16 right-0 w-full bg-white border-b px-4 py-2 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex justify-start">
                    <button className={`${openToggleButton ? 'block' : 'hidden'}`} onClick={toggleSidebar}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="sidebar-item-icon"
                            width="32" 
                            height="32" 
                            viewBox="0 -4 22 22"
                        >
                            <path fill="currentColor" d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z"/>
                        </svg>
                    </button>
                </div>
                <Link to={ROUTES.USER.PROFILE} className="flex items-center justify-end">
                    {user ? (
                        <>
                            <button 
                              type="button" 
                              className="flex flex-col px-3 text-right" 
                              aria-expanded="false">
                                <span className="text-xs font-semibold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </span>
                                <span className="text-[10px] text-gray-900">{user.email}</span>
                            </button>
                            <button 
                              type="button" 
                              className="rounded-full focus:ring-0 focus:ring-gray-200 focus:ring-offset-1 focus:ring-offset-gray-200" 
                              aria-expanded="false">
                                <img 
                                    src={user.profile_photo || "/default-avatar.png"} 
                                    alt="User Photo" 
                                    className="size-10 rounded-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-avatar.png";
                                    }}
                                />
                            </button>
                            </>
                        ) : (
                            <span className="text-xs text-gray-500">Cargando usuario...</span>
                        )}
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
