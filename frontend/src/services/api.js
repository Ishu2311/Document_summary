import axios from "axios";

const API = axios.create({
  baseURL: "https://document-summary-backend-ld7c.onrender.com",
  timeout: 120000,
});

export default API;