import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export interface APIError {
  message: string;
  status: string;
}

export const api = axios.create({
  baseURL: "https://api.albarqiq.net/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   async (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (error.response.status === 401) {
//       const isRefreshTokenRequest =
//         originalRequest?.url?.includes("refresh-token");

//       if (isRefreshTokenRequest) {
//         authStore.getState().logout();
//         toast.error("تم انتهاء الجلسة");
//         return Promise.reject(error);
//       }

//       if (!isRefreshTokenRequest && refreshToken) {
//         try {
//           const response = await refreshTokenService(refreshToken);
//           const newToken = response.token;
//           localStorage.setItem("token", newToken);
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return await api(originalRequest);
//         } catch (e) {
//           authStore.getState().logout();
//           toast.error("تم انتهاء الجلسة");
//           return Promise.reject(error);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );
