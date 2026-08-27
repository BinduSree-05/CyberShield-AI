import axios from "axios";

const api = axios.create({
  baseURL: "https://cybershield-ai-zn81.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;