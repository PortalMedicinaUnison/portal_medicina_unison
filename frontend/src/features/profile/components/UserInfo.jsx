import React from 'react';
import { useUser } from "../../../contexts/UserContext";

function UserInfo() {
  const { user } = useUser(); 

  return (
    <div className="user-info-card">
      {user ? (
        <div className="user-info-container">
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
          <div className="user-info-details">
            <dl className="user-info-list">
              <div className="user-info-row">
                <dt className="form-label">Nombre completo</dt>
                <dd className="user-info-data">
                  {user.first_name} {user.last_name} {user.second_last_name}
                </dd>
              </div>

              <div className="user-info-row">
                <dt className="form-label">Correo electrónico</dt>
                <dd className="user-info-data">{user.email}</dd>
              </div>

              <div className="user-info-row">
                <dt className="form-label">Expediente</dt>
                <dd className="user-info-data">{user.academic_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-500">Cargando usuario...</span>
      )}
    </div>
  );
}

export default UserInfo;
