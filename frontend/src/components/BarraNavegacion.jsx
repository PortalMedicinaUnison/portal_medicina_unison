
function BarraNavegacion() {

    function hideSidebar(){
        const sidebar = document.getElementById("sidebar");
        // sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.width = '0cm';
        const showButton = document.getElementById("show-sidebar-button");
        showButton.style.display = 'block';
        const header = document.getElementById("header");
        header.style.justifyContent = 'space-between';
        const mainContent = document.getElementById("main-content");
        mainContent.style.width = '100vw';
    }

    return (
        <div id="sidebar" className="sidebar">
            <div className="hide-button-section">
                <button className="hide-sidebar-button" onClick={hideSidebar}>Ocultar</button>
            </div>
            <div className="logo">
                <a href="inicio">
                    <img src="logo_unison.png" alt="Logo"/>
                </a>
            </div>
            <aside className="nav">
                <a href="inicio" className="nav-item">Inicio</a>
                <a href="avisos" className="nav-item">Avisos</a>
                <a href="historiaClinica" className="nav-item">Historia Clínica</a>
                <a href="reportes" className="nav-item">Reportes</a>
                <a href="documentos" className="nav-item">Documentos</a>
            </aside>
        </div>
    );
}

export default BarraNavegacion;