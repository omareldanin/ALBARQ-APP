import { api } from "@/api";
import { authStore } from "@/store/authStore";
import Toast from "react-native-toast-message";

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  status: string;
  token: string;
  refreshToken: string;
}

export const signInService = async (data: SignInRequest) => {
  const response = await api.post<SignInResponse>("/auth/signin", data);
  return response.data;
};

export const validateToken = async () => {
  try {
    const response = await api.post("/auth/validate-token");

    return response;
  } catch (e) {
    authStore.getState().logout();
    Toast.show({
      type: "error",
      text1: "حدث خطأ ❌",
      text2: "لقد انتهت صلاحية الجلسة الرجاء تسجيل الدخول مرة أخرى",
      position: "top",
    });
    throw e;
  }
};
