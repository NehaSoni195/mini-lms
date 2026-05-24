import axios from "axios";
import {
  getToken,
  saveToken,
  getRefreshToken,
  removeToken,
} from "../utils/storage";
import { refreshTokenApi } from "./auth.service";

const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
});

// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------- RESPONSE INTERCEPTOR ----------------
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        const res = await refreshTokenApi(refreshToken);

        const newAccessToken = res.data.data.accessToken;

        await saveToken(newAccessToken);

        // attach new token and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log("Refresh failed → logging out");

        await removeToken();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;