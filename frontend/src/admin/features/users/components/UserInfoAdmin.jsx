import { useParams, useNavigate } from 'react-router-dom';
import { useUserAdmin } from '../hooks/useUserAdmin';
import { ROUTES, adminAbs } from '../../../../config';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function UserDetail() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { userAdmin, loading, error, refetch } = useUserAdmin(parseInt(userId));

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error es: {String(error)}</p>;

    return (
        <div>
            {!userAdmin ? (
                <p>No se encontró el usuario.</p>
            ) : (
                <div className="info-container">
                    <div className="item-container">
                        <dl className="item-list">
                            <div className="item-row">
                                <dt className="item-header">Expediente</dt>
                                <dd className="item-text">{userAdmin.academic_id}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Nombre</dt>
                                <dd className="item-text">{userAdmin.first_name}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Rol</dt>
                                <dd className="item-text">  {userAdmin?.is_admin ? 'Administrador' : 'Alumno'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDetail;