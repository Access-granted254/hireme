import axios from "axios";

const ACCOUNTS_URL = "";
const LOCAL_ACCOUNTS_URL = "https://hire-a-developer.onrender.com/v1/users/";
const LOCAL_PROJECTS_URL = "https://hire-a-developer.onrender.com/v1/hire/";

export default axios.create({
  baseURL: ACCOUNTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const api = axios.create({
  baseURL: ACCOUNTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const localApi = axios.create({
  baseURL: LOCAL_ACCOUNTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const localProjectApi = axios.create({
  baseURL: LOCAL_PROJECTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
