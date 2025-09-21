import { useState, useEffect } from 'react';
import { getUserByAcademicIdRequest } from '../../../../services/userService';

export const useUserAdmin = (academicId) => {
    const [userAdmin, setUserAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserAcademicById = async (id) => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getUserByAcademicIdRequest(id);
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
        if (academicId) {
            getUserAcademicById(academicId);
        }
    }, [academicId]);

    const refetch = () => {
        if (academicId) {
            getUserAcademicById(academicId);
        }
    };

    return {
        userAdmin,
        loading,
        error,
        refetch,
        getUserAcademicById
    };
};