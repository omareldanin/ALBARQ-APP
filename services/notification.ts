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

export const getNotificationService = async (
  page: number,
  size: number,
  unRead: boolean
) => {
  const response = await api.get<NotificationsResponse>("/notifications", {
    params: {
      page,
      size,
      unRead: unRead || undefined,
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
export const updateOneNotificationService = async (id: number) => {
  const response = await api.patch("/notifications/" + id, {
    seen: true,
  });
  return response.data;
};
