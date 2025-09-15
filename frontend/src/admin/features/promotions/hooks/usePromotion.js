import { useState, useEffect } from 'react';
import { getPromotionByIdRequest } from '../../../../services/promotionService.js';

export const usePromotion = (promotionId) => {
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPromotionById = async (id) => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getPromotionByIdRequest(id);
            setPromotion(response.data);
            console.log('Promotion fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar la promoción');
            console.error('Error fetching promotion:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (promotionId) {
            getPromotionById(promotionId);
        }
    }, [promotionId]);

    const refetch = () => {
        if (promotionId) {
            getPromotionById(promotionId);
        }
    };

    return {
        promotion,
        loading,
        error,
        refetch,
        getPromotionById
    };
};