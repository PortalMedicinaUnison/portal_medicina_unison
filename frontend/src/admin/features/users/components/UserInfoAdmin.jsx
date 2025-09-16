import { useParams, useNavigate } from 'react-router-dom';
import { useUserAdmin } from '../hooks/useUserAdmin';
import { ROUTES, adminAbs } from '../../../../config';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function UserDetail() {
    const navigate = useNavigate();
    const { academicId } = useParams();
    const { userAdmin, loading, error, refetch } = useUserAdmin(academicId);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error es: {String(error)}</p>;

    return (
        <div>
            {!userAdmin ? (
                <p>No se encontró el usuario.</p>
            ) : (
              <div className="info-container">
                <div className="user-info-photo">
                    <img 
                    src={userAdmin.profile_photo || "/default-avatar.png"} 
                    alt="Foto de perfil" 
                    className="user-profile-photo"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                    }}
                    />
                </div>

                <div className="item-container">
                    <dl className="item-list">
                    <div className="item-row">
                        <dt className="item-header">Nombre completo</dt>
                        <dd className="item-text">
                        {userAdmin.first_name} {userAdmin.last_name} {userAdmin.second_last_name}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Correo electrónico</dt>
                        <dd className="item-text">{userAdmin.email}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Expediente</dt>
                        <dd className="item-text">{userAdmin.academic_id}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Teléfono</dt>
                        <dd className="item-text">{userAdmin.phone_number}</dd>
                    </div>
                    <div className="item-row">
                        <dt className="item-header">Rol</dt>
                        <dd className="item-text">{userAdmin.is_admin ? 'Administrador' : 'Alumno'}</dd>
                    </div>
                    </dl>
                </div>

                <div class="info-actions mt-16">
                    <button type="button" className='item-link'>Cambiar rol</button>
                    <button type="button" className='item-link'>Reset Password</button>
                </div>
              </div>
            )}
        </div>
    );
}

export default UserDetail;