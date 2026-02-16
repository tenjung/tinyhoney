import { createClient } from "@/lib/supabase/server";

interface ProfileRow {
    id: string;
    email: string | null;
    name: string | null;
    created_at: string;
    is_admin: boolean;
}

export default async function AdminRegistrationsPage() {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, name, created_at, is_admin")
        .order("created_at", { ascending: false })
        .limit(80);

    const rows = (profiles || []) as unknown as ProfileRow[];

    return (
        <section className="card-static" style={{ padding: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.2rem" }}>등록 관리</h2>
            <p style={{ fontSize: "0.86rem", color: "var(--color-slate-500)", marginBottom: "0.8rem" }}>
                현재는 회원 프로필 등록 현황을 관리합니다.
            </p>
            {error ? (
                <p style={{ color: "var(--color-rose-600)", fontSize: "0.9rem" }}>
                    profiles 데이터를 불러오지 못했습니다: {error.message}
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {rows.map((profile) => (
                        <div key={profile.id} style={{ display: "grid", gridTemplateColumns: "1fr 10rem 10rem", gap: "0.6rem", alignItems: "center", border: "1px solid var(--color-slate-200)", borderRadius: "0.65rem", padding: "0.65rem" }}>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {profile.name || profile.email || profile.id}
                                </p>
                                <p style={{ fontSize: "0.82rem", color: "var(--color-slate-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {profile.email || "-"}
                                </p>
                            </div>
                            <span className="badge">{profile.is_admin ? "관리자" : "일반회원"}</span>
                            <span style={{ fontSize: "0.82rem", color: "var(--color-slate-500)" }}>
                                {new Date(profile.created_at).toLocaleString("ko-KR")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
