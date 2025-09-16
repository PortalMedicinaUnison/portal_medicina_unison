import { useState, useEffect } from 'react';
import { getAllUsersRequest } from '../../../../services/userService';

const useGetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUsersRequest();
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

export default useGetUsers;