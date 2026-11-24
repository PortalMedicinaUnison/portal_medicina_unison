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
        title="No se pudieron cargar los cupos"
        message="Intenta recargar la información."
        details={fetchError}
        onRetry={refetch}
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
              <th className='w-4/12'>Ocupados / Cupos</th>
            </tr>
          </thead>
          <tbody>
            {!psds || psds.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-6">
                  Esta promoción aún no tiene sedes asignadas.
                </td>
              </tr>
            ) : (
              psds.map((psd) => (
              <tr key={psd.psd_id}>
                <td className="text-left">{psd.site?.name}</td>
                <td>{psd.occupied ?? 0} / {psd.capacity}</td>
              </tr>
              ))
            )}
          </tbody>
          {psds?.length > 0 && (
            <tfoot>
              <tr className="font-semibold">
                <td className="text-left">Total</td>
                <td>
                  {psds.reduce((sum, psd) => sum + (psd.occupied ?? 0), 0)} / {psds.reduce((sum, psd) => sum + psd.capacity, 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default PsdListReadOnly;
