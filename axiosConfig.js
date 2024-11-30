import axios from 'axios';

// Set the base URL for all Axios requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
