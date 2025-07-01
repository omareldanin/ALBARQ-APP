import { api } from "@/api";

export const updateProfile = async (fcm: string) => {
  const response = await api.patch("/update-profile", {
    fcm,
  });
  return response.data;
};
