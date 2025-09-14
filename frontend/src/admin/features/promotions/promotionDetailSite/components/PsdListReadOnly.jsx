  import { useState } from 'react';
  import useGetPsds from '../hooks/useGetPsds';

  function PsdListReadOnly() {
    const [search, setSearch] = useState('');
    const { psds, loading: listLoading, error: listError, refetch } = useGetPsds();

    const searchQuery = search.trim().toLowerCase();
    const filtered = psds.filter((psd) => {
      if (!searchQuery) return true;
      return (
        String(psd.site_id).includes(searchQuery)
      );
    });

    if (listLoading) return <p>Cargando registros…</p>;
    if (listError) return <p>Error es: {String(listError)}</p>;

    return (
      <div className="table-container">
        <div className="table-container-actions flex justify-end">
          <input
            className="form-input--sm"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por sede"
          />
        </div>

        <div className="table-container-body">
          <table className="table">
            <thead className="text-xs text-gray-700 bg-gray-50">
              <tr>
                <th>Sede</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.psd_id}>
                  <td>{item.site.name}</td>
                  <td>{item.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  export default PsdListReadOnly;
