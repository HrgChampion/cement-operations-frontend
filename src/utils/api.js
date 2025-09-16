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

export async function fetchPredictions(limit = 50) {
  const res = await API.get(`/ml/predictions`, {
    params: { limit },
  });
  // some backends wrap predictions inside { predictions: [...] }
  return res.data.predictions || res.data;
}

export async function fetchLatestHistory(limit = 100) {
  const res = await API.get(`/data/batch`, {
    params: { size: limit },
  });
  return res.data;
}

export async function fetchKpis() {
  const res = await API.get("/api/kpis");
  return res.data;
}

export default API;
