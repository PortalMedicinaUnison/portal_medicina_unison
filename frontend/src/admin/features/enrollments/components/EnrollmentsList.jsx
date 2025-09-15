import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetEnrollments from '../hooks/useGeEnrollments';
import useDeleteEnrollment from '../hooks/useDeleteEnrollment';

function EnrollmentsList() {
    const navigate = useNavigate();
    const { enrollments, loading: listLoading, error: listError, refetch } = useGetEnrollments();
    const { deleteEnrollment, loading: deleting, success: deleteSuccess, error: deleteError } = useDeleteEnrollment();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

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

    const filtered = enrollments.filter((enrollment) => {
        const searchQuery = search.trim().toLowerCase();
        if (!searchQuery) return true;
        return (
            String(enrollment.student_id).toLowerCase().includes(searchQuery)
        );
    });

    if (listLoading) return <p>Cargando registros…</p>;
    if (listError) return <p>Error es: {String(listError)}</p>;

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input
                    className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar por expediente'
                />
            </div>

            <div className='table-container-body'>
                <table className='table'>
                    <thead className="text-xs text-gray-700 bg-gray-50 ">
                        <tr>
                            <th>Expediente</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {filtered.map((enrollment) => (
                            <tr key={enrollment.enrollment_id}>
                                <td>{enrollment.student_id}</td>
                                <td>
                                    <button className="item-link" onClick={() => handleViewButton(item.psd_id)}>
                                        Ver
                                    </button>
                                </td>
                                <td>
                                    <button className="item-link" onClick={() => handleEditButton(item.psd_id)}>
                                        Editar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="table-action"
                                        onClick={() => handleDeleteButton(item.psd_id)}
                                        disabled={deleting}
                                        >
                                        {deleting ? 'Borrando…' : 'Borrar'}
                                    </button>
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