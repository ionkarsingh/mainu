const API_BASE_URL = 
  import.meta.env.MODE === 'production' 
    ? 'https://hostel-mern-copy.vercel.app' 
    : 'http://localhost:3000';

export default API_BASE_URL;
