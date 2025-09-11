import { useParams, useNavigate } from 'react-router-dom';
import { usePromotion } from '../hooks/usePromotion';

function PromotionDetail() {
    const { promotionId } = useParams();
    const navigate = useNavigate();
    const { promotion, loading, error, refetch } = usePromotion(parseInt(promotionId));

    const handleDeletePromotion = () => {
        const userConfirmed = confirm('¿Estás seguro de que deseas marcar esta promoción?');
        if (userConfirmed) {
            console.log('Deleting promotion:', promotionId);
        }
    };

    return (
        <div>
            {loading && (
                <span className="text-xs text-gray-500">Cargando información de la promoción...</span>
            )}

            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <h3>Error al cargar la promoción</h3>
                        <p>{error}</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/promotions')}
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            )}

            {promotion ? (
                <div className="info-container">
                    <div className="item-container">
                        <dl className="item-list">
                            <div className="item-row">
                                <dt className="item-header">Año</dt>
                                <dd className="item-text">{promotion.year}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Periodo</dt>
                                <dd className="item-text">{promotion.period}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">¿Esta finalizado?</dt>
                                <dd className="item-text">  {promotion?.is_finished ? 'Finalizado' : 'No finalizado'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="info-actions mt-16">
                        <button 
                            type="button" 
                            className='item-link'
                            onClick={() => navigate(`/promotions/${promotion.id}/edit`)}
                        >
                            Eliminar promoción
                        </button>
                    </div>
                </div>
            ) : !loading && (
                <span className="text-xs text-gray-500">Promoción no encontrada</span>
            )}
        </div>
    );
}

export default PromotionDetail;