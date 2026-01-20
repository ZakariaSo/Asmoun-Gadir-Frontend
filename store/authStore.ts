import { create } from "zustand";

type User = {
  id: number;
  email: string;
  role: "tourist" | "accommodation" | "admin";
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: (token, user) =>
    set({
      token,
      user,
    }),

  logout: () =>
    set({
      token: null,
      user: null,
    }),
}));
