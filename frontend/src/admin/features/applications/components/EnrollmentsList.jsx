import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetEnrollments from '../hooks/useGetEnrollments';
import useDeleteEnrollment from '../hooks/useDeleteEnrollment';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function EnrollmentsList() {
  const navigate = useNavigate();
  const { enrollments, loading: listLoading, error: listError, refetch } = useGetEnrollments();
  const { deleteEnrollment, loading: deleting, success: deleteSuccess, error: deleteError } = useDeleteEnrollment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return enrollments.filter((enrollment) => {
      if (!searchQuery) return true;
      return String(enrollment.student_id).toLowerCase().includes(searchQuery);
    });
  }, [enrollments, searchQuery]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.ENROLLMENT_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.ENROLLMENT_EDIT(id)));
  };

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
          className="form-input--sm mr-auto"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por expediente"
        />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead className="text-xs text-gray-700 bg-gray-50 ">
            <tr>
              <th>Expediente</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.enrollment_id}>
                <td>{item.student_id}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="td-actions text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.enrollment_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.enrollment_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.enrollment_id), className: 'text-red-600' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollmentsList;
