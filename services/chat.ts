import { api } from "@/api";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface Filters {
  page: number;
  size: number;
  status: keyof typeof orderStatusArabicNames | undefined;
  unRead?: string;
}

export interface Chat {
  id: number;
  unseenMessages: number;
  orderId: string | null;
  receiptNumber: string | undefined;
  lastMessage: {
    createdAt: Date;
    createdBy: {
      name: string;
      id: number;
    } | null;
    image: string | null;
    content: string;
  };
}

interface ChatResponse {
  totalUnSeened: number;
  pageCounts: number;
  count: number;
  page: number | undefined;
  chats: Chat[];
}
export interface Message {
  id: number;
  createdAt: Date;
  createdBy: {
    name: string;
    id: number;
  } | null;
  image: string | null;
  content: string;
}
interface ChatMessagesResponse {
  data: Message[];
}

export const getChatService = async ({
  page,
  size,
  status,
  unRead,
}: Filters) => {
  const response = await api.get<ChatResponse>("/chats", {
    params: {
      page: page || 1,
      size: size || 30,
      status: status || undefined,
      unRead: unRead || undefined,
    },
  });
  return response.data;
};

export const getChatMessagesService = async (orderId: string) => {
  const response = await api.get<ChatMessagesResponse>("/chats/messages", {
    params: {
      orderId,
    },
  });
  return response.data;
};

export const sendMessageService = async (data: FormData) => {
  const response = await api.post("/send-message", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMessagesSeenService = async () => {
  const response = await api.patch("/chats/markAllSeen", {
    seen: true,
  });
  return response.data;
};
