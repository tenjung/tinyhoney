import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserContext } from "@/lib/auth/user-context";

export default async function MyPage() {
    const ctx = await getCurrentUserContext();
    if (!ctx.user) {
        redirect("/auth/login");
    }

    return (
        <div className="dash-wrap" style={{ maxWidth: "52rem" }}>
            <section className="card-static" style={{ padding: "1.5rem" }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1rem" }}>마이페이지</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                        style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "9999px",
                            overflow: "hidden",
                            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                        }}
                    >
                        {ctx.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ctx.avatarUrl} alt={ctx.nickname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            "🐝"
                        )}
                    </div>
                    <div>
                        <p style={{ fontSize: "1.05rem", fontWeight: 800 }}>{ctx.nickname}</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--color-slate-500)" }}>{ctx.user.email}</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <Link href="/mypage/settings" className="btn btn-primary">
                        정보 설정
                    </Link>
                    {ctx.isAdmin ? (
                        <Link href="/admin" className="btn btn-outline">
                            관리자 페이지
                        </Link>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
