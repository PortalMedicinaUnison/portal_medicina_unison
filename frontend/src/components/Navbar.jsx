import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config';
import { useUser } from '../contexts/UserContext';
import useAuth from '../features/auth/hooks/useAuth';
import DropdownMenu from '../utils/ui/DropdownMenu';
import UserAvatar from './UserAvatar';

function Navbar({ toggleSidebar, openToggleButton }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useAuth();

  return (        
    <nav className="top-0 w-full border-b lg:px-2 ">
      <div className="flex items-center justify-between">
        <div className="flex">
          <button className={`${openToggleButton ? 'block' : 'hidden'}`} onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-item-icon"
              width="32" 
              height="32" 
              viewBox="0 0 22 22"
            >
              <path fill="currentColor" d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z"/>
            </svg>
          </button>
        </div>

        {user && (
          <DropdownMenu
            icon={({ isOpen }) => (
              <div className="flex items-center justify-end gap-2">
                <div className="flex flex-col px-3 text-right">
                  <span className="text-xs font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                  </span>
                  <span className="text-[10px] text-gray-900">{user.email}</span>
                </div>

                <UserAvatar
                  user={user}
                  className={`size-10 rounded-full ring-1 ${isOpen ? 'ring-gray-300' : 'ring-transparent'}`}
                />
              </div>
            )}
            actions={[
                {label: 'Ver perfil', onClick: () => navigate(ROUTES.USER.PROFILE)},
                {label: 'Aviso de privacidad', onClick: () => navigate(ROUTES.PRIVACY_NOTICE)},
                {label: 'Cerrar sesión', onClick: logout, className: 'text-red-600'},
            ]}
            hover={false}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
