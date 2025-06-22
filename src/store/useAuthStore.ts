// useBearStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type UserType = {
  id: string;
  email: string;
  password: string;
  role: string;
}

type AuthType = {
  token: string;
  user: UserType,
  setToken: (payload: string) => void;
  setUser: (payload: UserType) => void;
  reset: () => void;
};

const initialState = {
  token: "",
  user: {
    id: "",
    email: "",
    password: "",
    role: ""
  },
}

export const useAuthStore = create<AuthType>()(
  immer(persist(
    (set) => ({
      ...initialState,
      reset: () => {
        set(initialState)
      },
      setToken: (payload: string) => set((state) => {
        state.token = payload
      }),
      setUser: (user: UserType) => set((state) => {
        state.user = user
      }),
    }),

    {
      name: 'auth',
    },
  )));
