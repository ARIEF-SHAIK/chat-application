// services/api.js (CORRECTED)
import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/' 
});


API.interceptors.request.use((req) => {

  // ✅ FIX: Read the token as a plain string, NOT parsed JSON.
  const token = localStorage.getItem('token'); 
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;