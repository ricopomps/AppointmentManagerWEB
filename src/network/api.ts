import axios from "axios";
const { REACT_APP_API_BASE_URL: baseUrl } = process.env;

export const API = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
