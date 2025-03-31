import Encabezado from "./Encabezado";

function ContenidoPrincipal({children, user}) {
    return (
        <div id="main-content" className="main-content">
            
            <div className="content">
                {children}
            </div>
        </div>
    );
}

export default ContenidoPrincipal;