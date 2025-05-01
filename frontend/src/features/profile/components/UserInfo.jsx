import React from 'react';
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

function UserInfo() {
  const { user } = useUser();
  const navigate = useNavigate(); // Inicializa useNavigate

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

            <div>
              <p className='item-link'>Cambiar foto</p>
              <p className='item-text'>Esto ayudará a tu administrador a identificarte</p>
            </div>
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
            </dl>
          </div>

          <div class="info-actions">
            <button type="button" className='item-link'>Reset Password</button>
          </div>

          <div class="info-actions">
            <button type="button" className='item-link'>Remove account</button>
          </div>

        </div>
      ) : (
        <span className="text-xs text-gray-500">Cargando usuario...</span>
      )}

      {/* Botón Editar */}
      <div className="button-group">
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/editar-perfil")} // Redirige a editar-perfil
        >
          Editar
        </button>
      </div>
    </div>
  );
}

export default UserInfo;

