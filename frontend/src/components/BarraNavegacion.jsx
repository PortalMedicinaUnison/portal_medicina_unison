
function BarraNavegacion() {
    return (
        <div className="sidebar">
            <div className="logo">
                <a href="user">
                    <img src="src/components/logo_unison.png" alt="Logo"/>
                </a>
            </div>
            <aside className="nav">
                <a href="#" className="nav-item active">
                Avisos
                </a>
                <a href="medical" className="nav-item">
                Historia Clínica
                </a>
                <a href="#" className="nav-item">
                Reportes
                </a>
                <a href="#" className="nav-item">
                Documentos
                </a>
                <div className="settings">
                    <a href="#" className="nav-item">
                        Settings
                    </a>
                </div>
            </aside>
        </div>
    );
}

export default BarraNavegacion;