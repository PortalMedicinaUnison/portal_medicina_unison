import { useState, useEffect, useCallback } from 'react';
import { getAllUsersRequest } from '../../../../services/userService'
import { getErrorMessage } from '../../../../utils/errors';


// includeInactive: también trae las cuentas desactivadas (lista de administración).
export default function useGetUsers ({ includeInactive = false } = {}) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUsersRequest(includeInactive ? { include_inactive: true } : {});
      setUsers(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);
    
  useEffect(() => {
    getUsers();
  }, [getUsers]);
    
  return { users, loading, error, refetch: getUsers };
};