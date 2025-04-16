// contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const access_token = { token: sessionStorage.getItem("access_token") };    

      if (!access_token.token) {
        setError("No access token found");
        return;
      }
        
      try {
        const verifyResponse = await api.post('/auth/verify-token/', access_token);
        const userId = verifyResponse.data.user_info.user_id;
        const userResponse = await api.get(`/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${access_token.token}`
          }
        });
        
        setUser(userResponse.data);
      } catch (error) {
        console.error("User not found", error);
        setError("User not found");
      }
    };

    fetchUser();
  }, []);

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ user, clearUser, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}