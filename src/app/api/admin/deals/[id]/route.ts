import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getCurrentUserContext } from "@/lib/auth/user-context";
import { isDealsSchemaOutdated } from "@/lib/supabase/deals-schema";

interface PatchPayload {
    isHidden?: boolean;
    isLowest?: boolean;
    adminNote?: string;
}

function getServiceSupabase() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { db: { schema: "tinyhoney" } }
    );
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const ctx = await getCurrentUserContext();
    if (!ctx.user) {
        return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    }
    if (!ctx.isAdmin) {
        return NextResponse.json({ ok: false, error: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const { id } = await params;
    const dealId = Number(id);
    if (!Number.isInteger(dealId) || dealId <= 0) {
        return NextResponse.json({ ok: false, error: "잘못된 딜 ID입니다." }, { status: 400 });
    }

    const body = (await request.json()) as PatchPayload;
    const updates: Record<string, unknown> = {
        moderated_by: ctx.user.id,
        moderated_at: new Date().toISOString(),
    };

    if (typeof body.isHidden === "boolean") {
        updates.is_hidden = body.isHidden;
    }

    if (typeof body.isLowest === "boolean") {
        updates.is_lowest = body.isLowest;
    }

    if (typeof body.adminNote === "string") {
        const trimmed = body.adminNote.trim();
        updates.admin_note = trimmed.length > 0 ? trimmed : null;
    }

    if (Object.keys(updates).length <= 2) {
        return NextResponse.json({ ok: false, error: "변경할 값을 전달해주세요." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data: updatedDeal, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", dealId)
        .select("id, is_hidden, is_lowest, admin_note, moderated_at")
        .single();

    if (error) {
        if (isDealsSchemaOutdated(error.message)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "DB 마이그레이션이 적용되지 않았습니다. deals 관리 컬럼을 먼저 생성해주세요.",
                },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: "핫딜 상태 저장에 실패했습니다." },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true, deal: updatedDeal });
}
