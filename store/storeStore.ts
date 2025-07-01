import { Store, getStoresService } from "@/services/getStores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreStore {
  stores: Store[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchStores: () => Promise<void>;
  refreshStores: () => Promise<void>;
}

export const useStoreStore = create<StoreStore>()(
  persist(
    (set, get) => ({
      stores: [],
      loading: false,
      error: null,
      hasFetched: false,

      fetchStores: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getStoresService();
          set({
            stores: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load stores",
            loading: false,
          });
        }
      },

      refreshStores: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getStoresService();
          set({
            stores: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to refresh stores",
            loading: false,
          });
        }
      },
      reset: () => {
        set({
          stores: [],
          loading: false,
          error: null,
          hasFetched: false,
        });
      },
    }),
    {
      name: "store-storage",
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) =>
          AsyncStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    }
  )
);
