import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("ems_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ems_token");
      localStorage.removeItem("ems_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default client;
