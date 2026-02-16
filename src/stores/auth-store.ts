import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    nickname: string;
    avatarUrl: string | null;
    isAdmin: boolean;
    initialized: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: { nickname: string; avatarUrl: string | null; isAdmin: boolean }) => void;
    setInitialized: (initialized: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    nickname: "게스트",
    avatarUrl: null,
    isAdmin: false,
    initialized: false,
    setUser: (user) => set({ user }),
    setProfile: ({ nickname, avatarUrl, isAdmin }) => set({ nickname, avatarUrl, isAdmin }),
    setInitialized: (initialized) => set({ initialized }),
    clearAuth: () =>
        set({
            user: null,
            nickname: "게스트",
            avatarUrl: null,
            isAdmin: false,
            initialized: true,
        }),
}));
