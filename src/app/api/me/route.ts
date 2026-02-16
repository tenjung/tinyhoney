import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/auth/user-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const ctx = await getCurrentUserContext();

    if (!ctx.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        id: ctx.user.id,
        email: ctx.user.email,
        nickname: ctx.nickname,
        avatarUrl: ctx.avatarUrl,
        isAdmin: ctx.isAdmin,
    });
}

export async function PATCH(request: Request) {
    const ctx = await getCurrentUserContext();
    if (!ctx.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { nickname?: string; avatarUrl?: string | null };
    const nickname = (body.nickname ?? "").trim();
    const avatarUrl = (body.avatarUrl ?? "").trim();

    if (!nickname) {
        return NextResponse.json({ error: "닉네임은 필수입니다." }, { status: 400 });
    }

    const supabase = await createClient();
    const payload = {
        id: ctx.user.id,
        email: ctx.user.email,
        name: nickname,
        image: avatarUrl || null,
        keywords: [],
        alert_enabled: true,
        is_admin: ctx.isAdmin,
    };

    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
        return NextResponse.json(
            { error: "프로필 저장에 실패했습니다. profiles 테이블/RLS를 확인해주세요." },
            { status: 500 }
        );
    }

    return NextResponse.json({
        ok: true,
        nickname,
        avatarUrl: avatarUrl || null,
        isAdmin: ctx.isAdmin,
    });
}
