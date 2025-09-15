import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api.js';
import { ROUTES, adminAbs } from '../../../../config.js';


function PromotionsList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('available');
    const [promotions, setPromotions] = useState([]);
    const navigate = useNavigate();


    const getPromotions = async () => {
        try {
            const response = await api.get("/promotions/");
            setPromotions(response.data);
            console.log("Promotions loaded successfully", response.data);
        } catch (error) {
            console.error("Error loading promotions", error);
        }
    };
    
    useEffect(() => {
        getPromotions();
    }, []);
    
    const handleViewButton = (promotionId) => {
        navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(promotionId)));
    };
    
    const handleEditButton = (promotionId) => {
        console.log('Edit promotion:', promotionId);
    };
    
    const handleDeleteButton = (promotionId) => {
        const deletePromotion = async () => {
            try {
                const response = await api.delete(`/promotions/${promotionId}`);
                await getPromotions();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('Esta promoción se eliminará. ¿Deseas continuar?');
        if (userConfirmed) {
            deletePromotion();
        }
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar promoción'
                />
            </div>

            <div className='table-container-body'>
            <table className='table'>
                <thead className="text-xs text-gray-700 bg-gray-50 ">
                    <tr>
                        <th>ID</th>
                        <th>Año</th>
                        <th>Periodo</th>
                        <th>¿Activa?</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {promotions.filter((item) => {
                        return (search.toLowerCase() === '' 
                            || item.name.toLowerCase().includes(search.toLowerCase())
                            || String(item.id).includes(search))
                    }).map((item) => (
                        <tr key={item.promotion_id}>
                            <td>{item.promotion_id}</td>
                            <td>{item.year}</td>
                            <td>{item.period}</td>
                            <td>{item.is_finished}</td>
                            <td>
                                <button className='item-link' onClick={e => handleViewButton(item.promotion_id)}>
                                    Ver
                                </button>
                            </td>
                            <td>
                                <button className='item-link' onClick={e => handleEditButton(item.promotion_id)}>
                                    Editar
                                </button>
                            </td>
                            {(statusFilter != 'unavailable') && (
                                <td>
                                    <button className='table-action' onClick={e => handleDeleteButton(item.promotion_id)}>
                                        Borrar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default PromotionsList;