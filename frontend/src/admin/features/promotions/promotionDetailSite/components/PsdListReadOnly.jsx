import useGetPsdsByProm from '../hooks/useGetPsdsByProm';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../../utils/ui/DataLoadError';


function PsdListReadOnly({ promotionId }) {
  const { psds, loading: fetching, error: fetchError, refetch } = useGetPsdsByProm(promotionId);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------
  return (
    <div className="table-container">
      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-8/12'>Sede</th>
              <th className='w-4/12'>Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {!psds || psds.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No hay sedes disponibles.
                </td>
              </tr>
            ) : (
              psds.map((item) => (
              <tr key={item.psd_id}>
                <td className="text-left">{item.site.name}</td>
                <td>{item.capacity}</td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>      
    </div>
  );
}
    
export default PsdListReadOnly;
