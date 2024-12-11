
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
        <div id="header" className="header">
            <button id="show-sidebar-button" className="show-sidebar-button" onClick={showSidebar}>Mostrar</button>
            <a className="user-info" href="perfil">
                <img src={`/profile_images/${image}`} alt="User Photo" className="user-avatar"/>
                <span className="user-name">{children}</span>
            </a>
        </div>
    );
}

export default Encabezado;