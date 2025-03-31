import Navbar from "./Navbar";
import '../styles.css';


function ContenidoPrincipal({children, user}) {
    return (
        <div id="main-content" className="main-container">
            <Navbar image={user.profile_image_path}>{user.first_name} {user.last_name} {user.second_last_name}</Navbar>
            <div className="content">
                {children}
            </div>
        </div>
    );
}

export default ContenidoPrincipal;