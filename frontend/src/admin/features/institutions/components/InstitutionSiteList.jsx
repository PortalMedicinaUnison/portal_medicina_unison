import { Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetSitesByInstitution from '../hooks/useGetSitesByInstitution';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';


// Sedes (activas) que pertenecen a una institución, con enlace a su detalle.
function InstitutionSiteList({ institutionId }) {
  const { sites, loading: fetching, error: fetchError, refetch } = useGetSitesByInstitution(institutionId);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner size="h-24" />;

  if (fetchError) {
    return (
      <div className="alert-error">
        <span>{fetchError}</span>
        <button type="button" className="font-semibold underline" onClick={refetch}>
          Reintentar
        </button>
      </div>
    );
  }

// ---------------------- RENDER ----------------------

  return (
    <div className="table-container">
      <h3 className="text-lg font-semibold text-gray-900">Sedes de la institución</h3>
      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-5/12'>Razón social</th>
              <th className='w-3/12'>Ciudad</th>
              <th className='w-4/12'>Jefe de enseñanza</th>
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Esta institución no tiene sedes registradas.
                </td>
              </tr>
            ) : (
              sites.map((site) => (
              <tr key={site.site_id}>
                <td className="text-left">
                  <Link to={adminAbs(ROUTES.ADMIN.SITE_DETAIL(site.site_id))} className="item-link">
                    {site.name}
                  </Link>
                </td>
                <td>{site.city}</td>
                <td className="text-left">{site.teaching_head_name}</td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstitutionSiteList;
