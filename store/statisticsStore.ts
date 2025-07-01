import {
  OrdersStatistics,
  getOrdersStatisticsService,
} from "@/services/getOrdersStatisticsService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StatisticsStore {
  statistics: OrdersStatistics | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchStatistics: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
}

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set, get) => ({
      statistics: null,
      loading: false,
      error: null,
      hasFetched: false,

      fetchStatistics: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getOrdersStatisticsService();
          set({
            statistics: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load statistics",
            loading: false,
          });
        }
      },

      refreshStatistics: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getOrdersStatisticsService();
          set({
            statistics: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to refresh statistics",
            loading: false,
          });
        }
      },
    }),
    {
      name: "statistics-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) =>
          AsyncStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
    }
  )
);
