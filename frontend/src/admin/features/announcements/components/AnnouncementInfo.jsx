import { useParams, useNavigate } from 'react-router-dom';
import { useAnnouncement } from '../hooks/useAnnouncement'; // Hook para obtener un anuncio

function AnnouncementDetail() {
    const { announcementId } = useParams();
    const navigate = useNavigate();
    // Usamos el hook para obtener el anuncio por su ID
    const { announcement, loading, error } = useAnnouncement(parseInt(announcementId));

    const handleDeleteAnnouncement = () => {
        const userConfirmed = confirm('¿Estás seguro de que deseas eliminar este anuncio?');
        if (userConfirmed) {
            // Aquí iría la lógica para llamar a la API y eliminar el anuncio
            console.log('Deleting announcement:', announcementId);
            // Por ejemplo: api.delete(`/announcements/${announcementId}`).then(() => navigate('/announcements'));
        }
    };

    // Función para mostrar el tipo de anuncio de forma legible
    const getAnnouncementTypeName = (typeEnum) => {
        if (typeEnum === 1) return 'General';
        if (typeEnum === 2) return 'Pasantía';
        return 'Desconocido';
    };

    return (
        <div>
            {loading && (
                <span className="text-xs text-gray-500">Cargando información del anuncio...</span>
            )}

            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <h3>Error al cargar el anuncio</h3>
                        <p>{error}</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/announcements')}
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            )}

            {announcement ? (
                <div className="info-container">
                    <div className="item-container">
                        <dl className="item-list">
                            <div className="item-row">
                                <dt className="item-header">Título del anuncio</dt>
                                <dd className="item-text">{announcement.title}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Descripción</dt>
                                <dd className="item-text">{announcement.description}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Tipo de Anuncio</dt>
                                <dd className="item-text">{getAnnouncementTypeName(announcement.announcement_type)}</dd>
                            </div>

                             <div className="item-row">
                                <dt className="item-header">Creado por</dt>
                                <dd className="item-text">{announcement.created_by}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="info-actions mt-16">
                        <button 
                            type="button" 
                            className='item-link-danger' // Asumiendo una clase para botones de peligro
                            onClick={handleDeleteAnnouncement}
                        >
                            Eliminar Anuncio
                        </button>
                    </div>
                </div>
            ) : !loading && (
                <span className="text-xs text-gray-500">Anuncio no encontrado</span>
            )}
        </div>
    );
}

export default AnnouncementDetail;
