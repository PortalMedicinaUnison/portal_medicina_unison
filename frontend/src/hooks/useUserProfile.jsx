import { useState, useEffect } from "react";
import api from "../api";

const useUserProfile = (userId) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return userData;
};

export default useUserProfile;
