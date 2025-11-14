import axios from "axios";

const API_BASE = "https://librarybackend-woev.onrender.com";

export default axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
