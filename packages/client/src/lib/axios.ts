import axios, { type AxiosRequestConfig } from "axios";

const axiosOptions: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_BACKEND_URL
};

const axiosInstance = axios.create(axiosOptions);
const axiosPrivateInstance = axios.create({ ...axiosOptions, withCredentials: true });

export { axiosInstance as default, axiosPrivateInstance };
