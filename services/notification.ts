import { api } from "@/api";

export interface Notifications {
  id: number;
  title: string;
  content: string;
  seen: boolean;
  createdAt: Date;
  orderId: string | null;
  user: {
    id: number;
    fcm: string;
  };
}
interface NotificationsResponse {
  unSeenCount: number;
  page: number;
  pagesCount: number;
  data: Notifications[];
}

export const getNotificationService = async (page: number, size: number) => {
  const response = await api.get<NotificationsResponse>("/notifications", {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

export const updateNotificationService = async () => {
  const response = await api.patch("/notifications", {
    seen: true,
  });
  return response.data;
};
