import { getLocationsService, Location } from "@/services/getLocations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationStore {
  locations: Location[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchLocations: () => Promise<void>;
  refreshLocations: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locations: [],
      loading: false,
      error: null,
      hasFetched: false,

      fetchLocations: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getLocationsService();
          set({
            locations: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load locations",
            loading: false,
          });
        }
      },

      refreshLocations: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getLocationsService();
          set({
            locations: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to refresh locations",
            loading: false,
          });
        }
      },
    }),
    {
      name: "location-storage",
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
