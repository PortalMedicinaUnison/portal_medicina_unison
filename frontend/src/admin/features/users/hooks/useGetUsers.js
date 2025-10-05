import { useState, useEffect, useCallback } from 'react';
import { getAllUsersRequest } from '../../../../services/userService'


export default function useGetUsers () {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUsersRequest();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getUsers();
  }, [getUsers]);
    
  return { users, loading, error, refetch: getUsers };
};