import Encabezado from "./Encabezado";

function ContenidoPrincipal({children, user}) {
    return (
        <div id="main-content" className="main-content">
            <Encabezado image={user.profile_image_path}>{user.first_name} {user.last_name} {user.second_last_name}</Encabezado>
            <div className="content">
                {children}
            </div>
        </div>
    );
}

export default ContenidoPrincipal;