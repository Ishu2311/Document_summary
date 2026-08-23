import axios from "axios";

const API = axios.create({
  baseURL: "https://document-summary-3.onrender.com",
  timeout: 120000,
});

export default API;