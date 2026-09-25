import axios from "axios";

const backendUrl = import.meta.env.VITE_AXIOS_NEST;

const conectNest = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export default conectNest;
