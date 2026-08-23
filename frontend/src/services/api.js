import axios from "axios";

const API = axios.create({
  baseURL: "https://document-summary-4m7b.onrender.com",
});

export default API;