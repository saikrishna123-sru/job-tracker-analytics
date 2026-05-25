import axios from "axios";

const API = axios.create({
  baseURL: "https://job-tracker-analytics.onrender.com/api"
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) req.headers.authorization = token;
  return req;
});

export default API;
