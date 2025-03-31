function Encabezado({ children, image, toggleSidebar, sidebarVisible }) {
    console.log("Encabezado renderizado, sidebarVisible:", sidebarVisible); // Depuración

    return (
        <div className="header">
            {!sidebarVisible && (
                <button className="show-sidebar-button" onClick={toggleSidebar}>
                    Mostrar
                </button>
            )}
            <a className="user-info" href="perfil">
                <img src={`/profile_images/${image}`} alt="User Photo" className="user-avatar" />
                <span className="user-name">{children}</span>
            </a>
        </div>
    );
}

export default Encabezado;
