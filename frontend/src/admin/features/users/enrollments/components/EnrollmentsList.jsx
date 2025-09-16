import { useState, useMemo } from 'react';
import useGetEnrollments from '../hooks/useGetEnrollments';
import useDeleteEnrollment from '../hooks/useDeleteEnrollment';
import DropdownMenu from '../../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';

function EnrollmentsList() {
  const { enrollments, loading: listLoading, error: listError, refetch } = useGetEnrollments();
  const { deleteEnrollment, loading: deleting, success: deleteSuccess, error: deleteError } = useDeleteEnrollment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return enrollments.filter((enrollment) => {
      if (statusFilter !== '') {
        const isEnrolled = statusFilter === 'true';
        if (enrollment.is_enrolled !== isEnrolled) 
          return false;
      }

      if (!searchQuery) return true;
      return String(enrollment.academic_id).toLowerCase().includes(searchQuery);
    });
  }, [enrollments, searchQuery, statusFilter]);

  const handleDeleteButton = async (id) => {
    const userConfirmation = window.confirm('El pre-registro del alumno se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    await deleteEnrollment(id);
    await refetch();
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          placeholder="Buscar por expediente"
          onChange={(e) => setSearch(e.target.value)}
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
              <th>Estatus</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">No se encontraron usuarios pre-registrados.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.enrollment_id}>
                  <td>{item.academic_id}</td>
                  <td>{item.is_enrolled ? 'Registrado' : 'No registrado'}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-right">
                    <DropdownMenu
                      actions={[
                        { label: 'Eliminar', onClick: () => handleDeleteButton(item.enrollment_id), className: 'text-red-600' },
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

export default EnrollmentsList;
