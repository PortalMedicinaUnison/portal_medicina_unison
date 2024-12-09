
function Encabezado({children, image}) {
    return (
        <div className="header">
            <div className="user-info">
                <img src={`src/components/${image}`} alt="User Photo" className="user-avatar"/>
                <span className="user-name">{children}</span>
            </div>
        </div>
    );
}

export default Encabezado;