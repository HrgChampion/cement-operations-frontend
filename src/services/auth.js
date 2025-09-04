import API from "../utils/api";

export const signup = async (userData) => {
  const { data } = await API.post("/auth/signup", userData);
  return data;
};

export const login = async (userData) => {
  const { data } = await API.post("/auth/login", userData);
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};