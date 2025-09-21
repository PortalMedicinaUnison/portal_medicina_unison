import { useState, useEffect, useCallback } from 'react';
import { getPromotionByIdRequest } from '../../../../services/promotionService.js';

export const usePromotion = (promotionId) => {
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);

    const fetchPromotion = useCallback(async (id) => {
        if (!id) return Promise.resolve();

        setLoading(true);
        setError(null);
        
        try {
            const response = await getPromotionByIdRequest(id);
            setPromotion(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error loading promotion');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (promotionId) {
            fetchPromotion(promotionId);
        }
    }, [promotionId, fetchPromotion]);

    const refetch = useCallback(() => {
        if (!promotionId) return Promise.resolve();
        return fetchPromotion(promotionId)
    }, [promotionId, fetchPromotion]);

    return {
        promotion,
        loading,
        error,
        refetch,
        fetchPromotion
    };
};