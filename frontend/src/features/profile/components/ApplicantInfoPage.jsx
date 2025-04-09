import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../Layout';
import api from '../../../api';
import fetchUser from '../../../utils/utils';

function ApplicantInfoPage() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        setApplicant(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error);
        setError("No se pudieron cargar los datos del solicitante");
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplicantData();
    }
  }, [userId]);

  if (loading) return <Layout><div>Cargando...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!applicant) return <Layout><div>No se encontraron datos del solicitante</div></Layout>;

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Información del Solicitante</h1>
        <dl className="divide-y divide-gray-100">
          {/* Información Personal */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Nombre completo</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {applicant?.nombre} {applicant?.apellido_paterno} {applicant?.apellido_materno}
            </dd>
          </div>
          {/* Información de Contacto */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Correo electrónico</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {applicant?.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Teléfono</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {applicant?.telefono}
            </dd>
          </div>

          {/* Información Académica */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="form-label">Expediente</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {applicant?.expediente}
            </dd>
          </div>
        </dl>
      </div>
    </Layout>
  );
}

export default ApplicantInfoPage;