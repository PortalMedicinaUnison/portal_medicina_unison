import React from 'react';
import { useUser } from "../../../contexts/UserContext";

function UserInfo() {
  const { user } = useUser(); 

  return (
    // <div className="user-info-card">
      // <h1 className="page-title">Información del Solicitante</h1>
      <dl className="user-info-list">
        {user ? (
          <>
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
          </>
        ) : (
          <span className="text-xs text-gray-500">Cargando usuario...</span>
        )}
      </dl>
    // </div>
  );
}

export default UserInfo;
