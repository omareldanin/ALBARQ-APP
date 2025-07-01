import { Branch, getBranchesService } from "@/services/getBranches";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BranchStore {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchBranches: () => Promise<void>;
  refreshBranches: () => Promise<void>;
}

export const useBranchStore = create<BranchStore>()(
  persist(
    (set, get) => ({
      branches: [],
      loading: false,
      error: null,
      hasFetched: false,

      fetchBranches: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getBranchesService();
          set({
            branches: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to load branches",
            loading: false,
          });
        }
      },

      refreshBranches: async () => {
        set({ loading: true, error: null });

        try {
          const response = await getBranchesService();
          set({
            branches: response.data,
            loading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to refresh branches",
            loading: false,
          });
        }
      },
      reset: () => {
        set({
          branches: [],
          loading: false,
          error: null,
          hasFetched: false,
        });
      },
    }),
    {
      name: "branches-storage",
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
