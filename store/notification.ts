import {
  getNotificationService,
  Notifications,
  updateNotificationService,
  updateOneNotificationService,
} from "@/services/notification";
import { create } from "zustand";

interface NotificationStore {
  notifications: Notifications[];
  allNotifications: Notifications[];
  unSeenCount: number;
  page: number;
  pagesCount: number;
  loading: boolean;

  // Actions
  fetchNotifications: (
    page: number,
    size: number,
    unRead: boolean
  ) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAllAsSeen: () => Promise<void>;
  markOneAsSeen: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  allNotifications: [],
  unSeenCount: 0,
  page: 1,
  pagesCount: 1,
  loading: false,

  // Fetch notifications (with cache)
  fetchNotifications: async (page: number, size: number, unRead: boolean) => {
    set({ loading: true });
    try {
      const data = await getNotificationService(page, size, unRead);
      set((state) => ({
        allNotifications:
          page === 1 ? data.data : [...state.allNotifications, ...data.data], // append if not first page        notifications: data.data,
        unSeenCount: data.unSeenCount,
        page: data.page,
        pagesCount: data.pagesCount,
      }));
    } catch (e) {
      console.error("❌ Error fetching notifications", e);
    } finally {
      set({ loading: false });
    }
  },

  // Refresh (force refetch first page)
  refreshNotifications: async () => {
    set({
      notifications: [],
      allNotifications: [],
      page: 1,
      pagesCount: 1,
    });
    await get().fetchNotifications(1, 25, false);
  },

  // Update seen status
  markAllAsSeen: async () => {
    try {
      await updateNotificationService();
      // Update store state without refetch
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, seen: true })),
        allNotifications: state.allNotifications.map((n) => ({
          ...n,
          seen: true,
        })),
        unSeenCount: 0,
      }));
    } catch (e) {
      console.error("❌ Error updating notifications", e);
    }
  },
  markOneAsSeen: async (id: number) => {
    try {
      await updateOneNotificationService(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, seen: true } : n
        ),
        allNotifications: state.allNotifications.map((n) =>
          n.id === id ? { ...n, seen: true } : n
        ),
        unSeenCount: Math.max(state.unSeenCount - 1, 0),
      }));
    } catch (e) {
      console.error("❌ Error updating one notification", e);
    }
  },
}));
