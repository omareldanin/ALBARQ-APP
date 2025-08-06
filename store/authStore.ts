import type { SignInResponse } from "@/services/signInService";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// export type JWTRole = keyof typeof rolesArabicNames | keyof typeof clientTypeArabicNames;
import { queryClient } from "@/lib/queryClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IAuthStore extends SignInResponse {
  setAuth: (data: SignInResponse) => void;
  logout: () => void;
  isLoggedIn: boolean;
  id: string;
  name: string;
  username: string;
  role: string | null;
  companyName: string;
  companyID: string;
  mainRepository: boolean;
  branchId: string;
  repositoryId: string;
  type: string;
  orderStatus: string[] | null;
  permissions: string[] | null;
}

interface TokenPayload {
  id: string;
  name: string;
  username: string;
  role: string | null;
  exp: number;
  iat: number;
  companyName: string | null;
  companyID: string | null;
  permissions: string[] | null;
  orderStatus: string[] | null;
  mainRepository: boolean;
  branchId: string;
  repositoryId: string;
  type: string;
}

export const authStore = create<IAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      status: "",
      token: "",
      companyName: "",
      refreshToken: "",
      companyID: "",
      id: "",
      name: "",
      role: null,
      username: "",
      mainRepository: false,
      branchId: "",
      repositoryId: "",
      type: "",
      orderStatus: null,
      permissions: null,
      setAuth: (data: SignInResponse) => {
        const decodedToken = jwtDecode<TokenPayload>(data.token);
        set({
          status: "success",
          companyName: decodedToken.companyName || "",
          token: data.token,
          id: decodedToken.id,
          name: decodedToken.name,
          refreshToken: data.refreshToken,
          username: decodedToken.username,
          role: decodedToken.role,
          companyID: decodedToken.companyID || "",
          mainRepository: decodedToken.mainRepository,
          branchId: decodedToken.branchId,
          repositoryId: decodedToken.repositoryId,
          type: decodedToken.type,
          orderStatus: decodedToken.orderStatus,
          permissions: decodedToken.permissions,
          isLoggedIn: true,
        });
        AsyncStorage.setItem("token", data.token);
        AsyncStorage.setItem("refreshToken", data.refreshToken);
      },
      logout: () => {
        set({
          status: "",
          token: "",
          companyName: "",
          refreshToken: "",
          id: "",
          name: "",
          username: "",
          role: null,
          companyID: "",
          branchId: "",
          repositoryId: "",
          type: "",
          isLoggedIn: false,
          orderStatus: null,
          permissions: null,
        });
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("refreshToken");
        queryClient.clear();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useAuth = () => authStore((state) => state);
