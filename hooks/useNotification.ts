import { getNotificationService } from "@/services/notification";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = (page: number) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotificationService(page, 30),
  });
};
