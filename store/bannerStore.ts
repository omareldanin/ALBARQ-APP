// store/bannerStore.ts
import { Banner, getBannersService } from "@/services/getBannersService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BannerStore {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  fetchBanners: () => Promise<void>;
  refreshBanners: () => Promise<void>;
  hasFetched: boolean;
}

export const useBannerStore = create<BannerStore>()(
  persist(
    (set, get) => ({
      banners: [],
      loading: false,
      error: null,
      hasFetched: false,
      fetchBanners: async () => {
        // Prevent refetching if data already fetched
        set({ loading: true, error: null });

        try {
          const response = await getBannersService();
          set({
            banners: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load banners",
            loading: false,
          });
        }
      },
      refreshBanners: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getBannersService();
          set({
            banners: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load banners",
            loading: false,
          });
        }
      },
      reset: () => {
        set({
          banners: [],
          loading: false,
          error: null,
          hasFetched: false,
        });
      },
    }),
    {
      name: "banner-storage",
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
