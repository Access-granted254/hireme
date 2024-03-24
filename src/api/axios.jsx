/* eslint-disable no-unused-vars */
import axios from "axios";

const LOCAL_ACCOUNTS_URL = "http://127.0.0.1:8000/v1/users/";
const LOCAL_PROJECTS_URL = "http://127.0.0.1:8000/v1/hire/";
const ACCOUNTS_URL = "https://hire-a-developer.onrender.com/v1/users/";
const PROJECTS_URL = "https://hire-a-developer.onrender.com/v1/hire/";

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
  baseURL: ACCOUNTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const localProjectApi = axios.create({
  baseURL: PROJECTS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
