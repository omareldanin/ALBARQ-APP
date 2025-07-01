import { getChatMessagesService } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";

export const useChat = (orderId: string) => {
  return useQuery({
    queryKey: ["messages", orderId],
    queryFn: () => getChatMessagesService(orderId),
  });
};
