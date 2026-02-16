"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@supabase/supabase-js";

function fallbackNickname(user: User): string {
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const name = meta?.name ?? meta?.full_name;
    if (typeof name === "string" && name.trim()) return name.trim();
    return user.email?.split("@")[0] || "회원";
}

function fallbackAvatar(user: User): string | null {
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const avatar = meta?.avatar_url;
    if (typeof avatar === "string" && avatar.trim()) return avatar.trim();
    return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setProfile = useAuthStore((state) => state.setProfile);
    const setInitialized = useAuthStore((state) => state.setInitialized);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const supabase = createClient();
        const syncProfile = async (user: User | null) => {
            if (!user) {
                clearAuth();
                return;
            }

            setUser(user);
            setProfile({
                nickname: fallbackNickname(user),
                avatarUrl: fallbackAvatar(user),
                isAdmin: false,
            });
            setInitialized(true);

            try {
                const res = await fetch("/api/me", { cache: "no-store" });
                if (!res.ok) return;
                const data = (await res.json()) as {
                    nickname?: string;
                    avatarUrl?: string | null;
                    isAdmin?: boolean;
                };
                setProfile({
                    nickname: data.nickname || fallbackNickname(user),
                    avatarUrl: data.avatarUrl || fallbackAvatar(user),
                    isAdmin: !!data.isAdmin,
                });
            } catch {
                // Keep fallback profile when API request fails.
            }
        };

        void supabase.auth.getSession().then(({ data }) => {
            void syncProfile(data.session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            void syncProfile(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [clearAuth, setInitialized, setProfile, setUser]);

    return <>{children}</>;
}
