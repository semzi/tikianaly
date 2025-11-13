import axios from "axios";

export default axios.create({
  baseURL: 'https://tikianaly-service-backend-g2fp.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});
