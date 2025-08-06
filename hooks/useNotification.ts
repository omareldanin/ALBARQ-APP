import { getNotificationService } from "@/services/notification";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = (page: number, unRead: boolean) => {
  return useQuery({
    queryKey: ["notifications", page, unRead],
    queryFn: () => getNotificationService(page, 30, unRead),
  });
};
