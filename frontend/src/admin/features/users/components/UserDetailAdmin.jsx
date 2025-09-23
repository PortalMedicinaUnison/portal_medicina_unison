import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import useUserAdmin from '../hooks/useUserAdmin';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import useUpdateUser from '../hooks/useUpdateUserAdmin';

import Modal from '../../../../utils/ui/Modal';

function UserDetail() {
    const { academicId } = useParams();
    const { user, loading, error, refetch } = useUserAdmin(academicId);

    const [open, setOpen] = useState(false);
    const [localError, setLocalError] = useState("");    

    const handleSuccess = async () => {
        await refetch();
        setOpen(false);
      };

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error es: {String(error)}</p>;

    return (
        <div>
            {!user ? (
                <p>No se encontró el usuario.</p>
            ) : (
              <div className="info-container">
                <div className="user-info-photo">
                    <img 
                    src={user.profile_photo || "/default-avatar.png"} 
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
                        {user.first_name} {user.last_name} {user.second_last_name}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Correo electrónico</dt>
                        <dd className="item-text">{user.email}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Expediente</dt>
                        <dd className="item-text">{user.academic_id}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Teléfono</dt>
                        <dd className="item-text">{user.phone_number}</dd>
                    </div>
                    <div className="item-row">
                        <dt className="item-header">Rol</dt>
                        <dd className="item-text">{user.is_admin ? 'Administrador' : 'Alumno'}</dd>
                    </div>
                    </dl>
                </div>

                <Modal
                    open={open}
                    title="Cambiar rol"
                    onClose={() => setOpen(false)}
                >
                <UpdateUserAdmin 
                    academicId={academicId} 
                    onClose={() => setOpen(false)}
                    onSuccess={handleSuccess} 
                />
                </Modal>

                <div class="info-actions mt-16">
                    <button 
                      type="button" 
                      className='item-link'
                      onClick={() => setOpen(true)}
                    >
                      Cambiar rol
                    </button>
                </div>
              </div>
            )}
        </div>
    );
}

export default UserDetail;