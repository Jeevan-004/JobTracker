import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    securityQuestion: string,
    securityAnswer: string
  ) => {
    const response = await api.post("/api/auth/signup", {
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
    });
    return response.data;
  },
};

export default api;
