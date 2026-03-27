import axios from "axios";
import { appConfig } from "../config/appConfig";

export const http = axios.create({
  baseURL: appConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});
