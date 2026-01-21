import { create } from "zustand";

type User = {
  id: number;
  email: string;
  name: string;
  role: "tourist" | "accommodation" | "admin";
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  setUser: (user: User) => void;
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

  setUser: (user) =>
    set({
      user,
    }),

  logout: () =>
    set({
      token: null,
      user: null,
    }),
}));
