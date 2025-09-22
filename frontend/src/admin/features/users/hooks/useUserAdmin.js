import { useState, useEffect, useCallback } from 'react';
import { getUserByAcademicIdRequest } from '../../../../services/userService';


export default function useUserAdmin(academicId) {
  const [user, setUserAdmin] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getUserAdmin = useCallback(async (academicId) => {
    if (!academicId) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserByAcademicIdRequest(academicId);
      setUserAdmin(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching user');
      setUserAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!academicId) {
      setUserAdmin(null);
      setError(null);
      setLoading(false);
      return;
    }
    getUserAdmin(academicId);
  }, [academicId, getUserAdmin]);

  const refetch = useCallback(() => {
    if (!academicId) return Promise.resolve();
    return getUserAdmin(academicId);
  }, [academicId, getUserAdmin]);

  return { user, loading, error, refetch, getUserAdmin };
};