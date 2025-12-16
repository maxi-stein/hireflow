import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JwtUser } from "../types/api/auth.types";

type AppStore = {
  user: JwtUser | null;
  token: string | null;
  setAuth: (user: JwtUser, token: string) => void;
  logout: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "app-store" }
  )
);
