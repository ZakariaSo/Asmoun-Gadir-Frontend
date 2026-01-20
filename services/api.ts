import axios from "axios";

const api = axios.create({
  baseURL: "http://10.33.2.74:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
