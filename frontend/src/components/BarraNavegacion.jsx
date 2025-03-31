function BarraNavegacion({ toggleSidebar }) {
    return (
        <div className="sidebar">
            <div className="hide-button-section">
                <button className="hide-sidebar-button" onClick={toggleSidebar}>Ocultar</button>
            </div>
            <div className="logo">
                <a href="inicio">
                    <img src="logo_unison.png" alt="Logo" />
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
