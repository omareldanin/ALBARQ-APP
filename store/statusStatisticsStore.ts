import {
  getStatusStatisticsService,
  ordersStatisticsByStatus,
} from "@/services/getOrdersStatisticsService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StatisticsStore {
  statusStatistics: ordersStatisticsByStatus[] | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchStatistics: (status: string) => Promise<void>;
  refreshStatistics: (status: string) => Promise<void>;
}

export const useStatusStatisticsStore = create<StatisticsStore>()(
  persist(
    (set, get) => ({
      statusStatistics: null,
      loading: false,
      error: null,
      hasFetched: false,

      fetchStatistics: async (status: string) => {
        set({ loading: true, error: null });

        try {
          const response = await getStatusStatisticsService(status);

          set({
            statusStatistics: response.data,
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

      refreshStatistics: async (status: string) => {
        set({ loading: true, error: null });

        try {
          const response = await getStatusStatisticsService(status);
          set({
            statusStatistics: response.data,
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
