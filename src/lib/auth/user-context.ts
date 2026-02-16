import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface UserContext {
    user: User | null;
    nickname: string;
    avatarUrl: string | null;
    isAdmin: boolean;
}

function emailPrefix(email: string | null | undefined): string {
    if (!email) return "게스트";
    return email.split("@")[0] || "게스트";
}

function inferNickname(user: User): string {
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const name = metadata?.name ?? metadata?.full_name;
    if (typeof name === "string" && name.trim()) return name.trim();
    return emailPrefix(user.email);
}

function inferAvatar(user: User): string | null {
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const avatar = metadata?.avatar_url;
    if (typeof avatar === "string" && avatar.trim()) return avatar.trim();
    return null;
}

export async function getCurrentUserContext(): Promise<UserContext> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            user: null,
            nickname: "게스트",
            avatarUrl: null,
            isAdmin: false,
        };
    }

    let nickname = inferNickname(user);
    let avatarUrl = inferAvatar(user);
    let isAdmin = false;

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, image, is_admin")
        .eq("id", user.id)
        .maybeSingle();

    if (!error && profile) {
        if (profile.name && profile.name.trim()) nickname = profile.name.trim();
        if (profile.image && profile.image.trim()) avatarUrl = profile.image.trim();
        if (profile.is_admin) isAdmin = true;
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (adminEmail && user.email?.toLowerCase() === adminEmail) {
        isAdmin = true;
    }

    return { user, nickname, avatarUrl, isAdmin };
}
