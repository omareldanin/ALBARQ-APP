import { Chat, Filters, getChatService } from "@/services/chat";
import { create } from "zustand";

interface ChatStore {
  chats: Chat[];
  totalUnSeened: number;
  page: number;
  pageCounts: number;
  loading: boolean;

  fetchChats: (filters: Filters) => Promise<void>;
  refreshChats: (filters: Filters) => Promise<void>;
  markChatSeen: (chatId: number) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  totalUnSeened: 0,
  page: 1,
  pageCounts: 1,
  loading: false,

  fetchChats: async (filters: Filters) => {
    set({ loading: true });
    try {
      const data = await getChatService(filters);

      set((state) => ({
        chats: data.chats,
        totalUnSeened: data.totalUnSeened,
        page: data.page || filters.page,
        pageCounts: data.pageCounts,
      }));
    } catch (e) {
      console.error("❌ Error fetching chats", e);
    } finally {
      set({ loading: false });
    }
  },

  refreshChats: async (filters: Filters) => {
    await get().fetchChats({ ...filters, page: 1 });
  },

  markChatSeen: (chatId: number) => {
    set((state) => {
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === chatId) {
          // Reduce total unseen by that chat's unseenMessages
          state.totalUnSeened -= chat.unseenMessages;
          return { ...chat, unseenMessages: 0 };
        }
        return chat;
      });

      // Ensure unseen can't go negative
      return {
        chats: updatedChats,
        totalUnSeened: Math.max(0, state.totalUnSeened),
      };
    });
  },
}));
