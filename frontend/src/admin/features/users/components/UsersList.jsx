import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetUsers from '../hooks/useGetUsers';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function UserList() {
  const navigate = useNavigate();
  const { users, loading: listLoading, error: listError, refetch } = useGetUsers();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return users.filter((user) => {
      if (!searchQuery) return true;
      return (
        String(user.academic_id).toLowerCase().includes(searchQuery) ||
        String(user.first_name).toLowerCase().includes(searchQuery) ||
        String(user.last_name).toLowerCase().includes(searchQuery) ||
        String(user.second_last_name).toLowerCase().includes(searchQuery)
      );
    });
  }, [users, searchQuery, statusFilter]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.USER_DETAIL_ACADEMIC(id)));
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o expediente"
        />
        <select
          className="btn-tertiary--light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Estatus</option>
          <option value="true">Registrado</option>
          <option value="false">No registrado</option>
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th>Expediente</th>
              <th colSpan={3}>Nombre</th>
              <th colSpan={2}>Correo</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">No se encontraron usuarios.</td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.user_id || item.academic_id}>
                <td>{item.academic_id}</td>
                <td colSpan={3}>{item.first_name} {item.last_name} {item.second_last_name}</td>
                <td colSpan={2}>{item.email}</td>
                <td>{item.is_admin ? 'Administrador' : 'Alumno'}</td>
                <td className="td-actions text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.academic_id) }
                    ]}
                  />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
