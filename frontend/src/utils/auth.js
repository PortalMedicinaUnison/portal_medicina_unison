export const setToken = (token) => {
    sessionStorage.setItem("access_token", token);
};

export const getToken = () => {
    return sessionStorage.getItem("access_token");
};

export const removeToken = () => {
    sessionStorage.removeItem("access_token");
};

export const isAuthenticated = () => {
  return !!getToken();
};
