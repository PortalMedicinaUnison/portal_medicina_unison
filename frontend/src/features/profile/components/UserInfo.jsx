import React, { useState, useEffect } from 'react';
import Layout from '../../../Layout';
import { useUser } from "../../../contexts/UserContext";


function UserInfo() {
  const { user } = useUser(); 
  return (
    
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Información del Solicitante</h1>
        <dl className="divide-y divide-gray-100">
          {/* Información Personal */}
          {user ? (
            <>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Nombre completo</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {user.first_name} {user.last_name} {user.second_last_name}
            </dd>
          </div>
          {/* Información de Contacto */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Correo electrónico</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>

          {/* Información Académica */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Expediente</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {user.academic_id}
            </dd>
          </div>
          </>
          ) : (
              <span className="text-xs text-gray-500">Cargando usuario...</span>
          )}
        </dl>
      </div>
  )    
      
}

export default UserInfo;