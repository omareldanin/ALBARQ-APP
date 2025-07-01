import { Client, getClientsService } from "@/services/getClients";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchClients: () => Promise<void>;
  refreshClients: () => Promise<void>;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      loading: false,
      error: null,
      hasFetched: false,

      fetchClients: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getClientsService();
          set({
            clients: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to fetch clients",
            loading: false,
          });
        }
      },

      refreshClients: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getClientsService();
          set({
            clients: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to refresh clients",
            loading: false,
          });
        }
      },
    }),
    {
      name: "clients-storage",
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
