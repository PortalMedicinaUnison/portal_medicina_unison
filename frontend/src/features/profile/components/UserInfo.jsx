import { useUser } from "../../../contexts/UserContext";


function UserInfo() {
  const { user } = useUser();

  return (
    <div>
      {user ? (
        <div className="info-container">
          <div className="user-info-photo">
            <img 
              src={user.profile_photo || "/default-avatar.png"} 
              alt="Foto de perfil" 
              className="user-profile-photo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>

          <div className="item-container">
            <dl className="item-list">
              <div className="item-row">
                <dt className="item-header">Nombre completo</dt>
                <dd className="item-text">
                  {user.first_name} {user.last_name} {user.second_last_name}
                </dd>
              </div>

              <div className="item-row">
                <dt className="item-header">Correo electrónico</dt>
                <dd className="item-text">{user.email}</dd>
              </div>

              <div className="item-row">
                <dt className="item-header">Expediente</dt>
                <dd className="item-text">{user.academic_id}</dd>
              </div>

              <div className="item-row">
                <dt className="item-header">Teléfono</dt>
                <dd className="item-text">{user.phone_number}</dd>
              </div>

              <div className="item-row">
                <dt className="item-header">Internado</dt>
                <dd className="item-text">{user.internship_id}</dd>
              </div>
            </dl>
          </div>

          <div class="info-actions mt-16">
            <button type="button" className='item-link'>Reset Password</button>
            <button type="button" className='item-link'>Remove account</button>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-500">Cargando usuario...</span>
      )}
    </div>
  );
}

export default UserInfo;

