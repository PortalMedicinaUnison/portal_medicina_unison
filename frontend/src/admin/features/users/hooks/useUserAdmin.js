import { useState, useEffect } from 'react';
import { getUserByIdRequest } from '../../../../services/userService';

export const useUserAdmin = (userId) => {
    const [userAdmin, setUserAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserById = async (id) => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getUserByIdRequest(id);
            setUserAdmin(response.data);
            console.log('User fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar la promoción');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getUserById(userId);
        }
    }, [userId]);

    const refetch = () => {
        if (userId) {
            getUserById(userId);
        }
    };

    return {
        userAdmin,
        loading,
        error,
        refetch,
        getUserById
    };
};