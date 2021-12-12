import axios from "axios";
import { ACCESS_TOKEN } from "context/Auth.context";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

export { axiosInstance };
