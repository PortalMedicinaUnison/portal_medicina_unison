import React from 'react';
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="component-container">
      <div className="component-container_header">
        <div className="component-container_header-content">
          <div className="component-container_pretitle">
            <p>Inicio</p>
          </div>
          <h2 className="page-title-1">
            Perfil
          </h2>
        </div>
        
        <div className="component-container_actions"> 
          <span className="show-on-sm">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/edit-profile")}
            >
              Editar
            </button>
          </span>
        </div>
      </div>
  
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

          <div class="info-actions">
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

