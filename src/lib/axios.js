import axios from "axios";

const baseURL = process.env.API_URL;

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

export default instance;
