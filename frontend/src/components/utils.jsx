import React from 'react';
import api from '../api';

const fetchUser = async (setUser) => {
  try {
    const access_token = { token: sessionStorage.getItem("access_token") };
    const response = await api.post("/get_current_user/", access_token);
    setUser(response.data);
  } catch (error) {
    console.error("User not found");
  }
};

export default fetchUser
