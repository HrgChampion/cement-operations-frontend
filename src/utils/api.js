import axios from "axios";

const API = axios.create({
  baseURL: "https://cement-operations-backend-594125598497.asia-south1.run.app/",
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
