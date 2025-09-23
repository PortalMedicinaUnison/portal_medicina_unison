import { useParams, useNavigate } from 'react-router-dom';
import usePromotion from '../hooks/usePromotion';
import { ROUTES, adminAbs } from '../../../../config';
import useDeletePromotion from '../hooks/useDeletePromotion';
import PsdListReadOnly from '../promotionDetailSite/components/PsdListReadOnly';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';

function PromotionDetail() {
    const navigate = useNavigate();
    const { promotionId } = useParams();
    const { promotion, loading, error, refetch } = usePromotion(parseInt(promotionId));
    const { deletePromotion, loading: deleting, success: deleteSuccess, error: deleteError } = useDeletePromotion();

    const handleDeleteButton = async (id) => {
        const ok = window.confirm('Esta promoción se eliminará. ¿Deseas continuar?');
        if (!ok) return;
    
        await deletePromotion(id);
        navigate(adminAbs(ROUTES.ADMIN.PROMOTION_LIST), { replace: true });
      };

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error es: {String(error)}</p>;

    return (
        <div>
            {!promotion ? (
                <p>No se encontró la promoción.</p>
            ) : (
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

                    <div className='mt-16'>
                        <PsdListReadOnly/>
                    </div>

                    <div className="info-actions mt-16">
                        <button 
                            type="button" 
                            className='item-link'
                            onClick={() => handleDeleteButton(promotionId)}
                        >
                            Eliminar promoción
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PromotionDetail;