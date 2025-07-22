import { useState, useEffect } from 'react';
import { getSiteByIdRequest } from '../../../../services/siteService.js';

export const useSite = (siteId) => {
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSiteById = async (id) => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getSiteByIdRequest(id);
            setSite(response.data);
            console.log('Site fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar el sitio');
            console.error('Error fetching site:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (siteId) {
            getSiteById(siteId);
        }
    }, [siteId]);

    // Función para refrescar los datos
    const refetch = () => {
        if (siteId) {
            getSiteById(siteId);
        }
    };

    return {
        site,
        loading,
        error,
        refetch,
        getSiteById
    };
};