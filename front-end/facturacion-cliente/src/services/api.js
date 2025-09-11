import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:8000/api", // tu backend de Django
    headers: {
      "Content-Type": "application/json",
    },
  });


  export default api;