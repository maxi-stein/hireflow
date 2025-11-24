import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/models/user.types";

type AppStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "app-store" }
  )
);
