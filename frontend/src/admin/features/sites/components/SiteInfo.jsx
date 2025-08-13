import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '../hooks/useSite';

function SiteDetail() {
    const { siteId } = useParams();
    const navigate = useNavigate();
    const { site, loading, error, refetch } = useSite(parseInt(siteId));

    const handleDeleteSite = () => {
        const userConfirmed = confirm('¿Estás seguro de que deseas marcar este sitio como no disponible?');
        if (userConfirmed) {
            // Aquí iría la lógica para eliminar/desactivar el sitio
            console.log('Deleting site:', siteId);
        }
    };

    return (
        <div>
            {loading && (
                <span className="text-xs text-gray-500">Cargando información del sitio...</span>
            )}

            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <h3>Error al cargar el sitio</h3>
                        <p>{error}</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/sites')}
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            )}

            {site ? (
                <div className="info-container">
                    <div className="item-container">
                        <dl className="item-list">
                            <div className="item-row">
                                <dt className="item-header">Nombre del sitio</dt>
                                <dd className="item-text">{site.name}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Institución</dt>
                                <dd className="item-text">{site.institution_id}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Ciudad</dt>
                                <dd className="item-text">{site.city}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Dirección</dt>
                                <dd className="item-text">{site.address}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Responsable principal</dt>
                                <dd className="item-text">{site.teaching_head_name}</dd>
                            </div>

                            {site.teaching_head_email && (
                                <div className="item-row">
                                    <dt className="item-header">Email del responsable</dt>
                                    <dd className="item-text">
                                        <a href={`mailto:${site.teaching_head_email}`} className="text-blue-600 hover:underline">
                                            {site.teaching_head_email}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {site.teaching_head_phone && (
                                <div className="item-row">
                                    <dt className="item-header">Teléfono del responsable</dt>
                                    <dd className="item-text">
                                        <a href={`tel:${site.teaching_head_phone}`} className="text-blue-600 hover:underline">
                                            {site.teaching_head_phone}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {site.teaching_deputy_name && (
                                <div className="item-row">
                                    <dt className="item-header">Responsable suplente</dt>
                                    <dd className="item-text">{site.teaching_deputy_name}</dd>
                                </div>
                            )}

                            {site.teaching_deputy_email && (
                                <div className="item-row">
                                    <dt className="item-header">Email del suplente</dt>
                                    <dd className="item-text">
                                        <a href={`mailto:${site.teaching_deputy_email}`} className="text-blue-600 hover:underline">
                                            {site.teaching_deputy_email}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {site.teaching_deputy_phone && (
                                <div className="item-row">
                                    <dt className="item-header">Teléfono del suplente</dt>
                                    <dd className="item-text">
                                        <a href={`tel:${site.teaching_deputy_phone}`} className="text-blue-600 hover:underline">
                                            {site.teaching_deputy_phone}
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="info-actions mt-16">
                        <button 
                            type="button" 
                            className='item-link'
                            onClick={() => navigate(`/sites/${site.id}/edit`)}
                        >
                            Eliminar sede
                        </button>
                    </div>
                </div>
            ) : !loading && (
                <span className="text-xs text-gray-500">Sitio no encontrado</span>
            )}
        </div>
    );
}

export default SiteDetail;