import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem("auth_token", token);
        set({ token, user });
      },
      clear: () => {
        localStorage.removeItem("auth_token");
        set({ token: null, user: null });
      },
    }),
    { name: "owner-auth" },
  ),
);
