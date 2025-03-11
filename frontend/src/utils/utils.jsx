import React from 'react';
import api from '../api';

const fetchUser = async (setUser) => {
  try {
    const access_token = { token: sessionStorage.getItem("access_token") };    
    const verifyResponse = await api.post('/auth/verify-token/', access_token);
    
    const userId = verifyResponse.data.user_info.user_id;
    const userResponse = await api.get(`/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${access_token.token}`
      }
    });
    
    setUser(userResponse.data);
  } catch (error) {
    console.error("User not found");
  }
};

export default fetchUser
