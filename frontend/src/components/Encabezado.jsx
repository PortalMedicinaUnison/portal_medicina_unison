
function Encabezado({children, image}) {
    return (
        <div className="header">
            <a className="user-info" href="perfil">
                <img src={`/profile_images/${image}`} alt="User Photo" className="user-avatar"/>
                <span className="user-name">{children}</span>
            </a>
        </div>
    );
}

export default Encabezado;