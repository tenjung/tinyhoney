import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface CommunityPostRow {
    id: number;
    title: string;
    created_at: string;
    board: { slug: string; name: string } | null;
    profile: { name: string | null; email: string | null } | null;
}

export default async function AdminCommunityPage() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("posts")
        .select("id, title, created_at, board:boards(slug,name), profile:profiles(name,email)")
        .order("created_at", { ascending: false })
        .limit(80);

    const posts = (data || []) as unknown as CommunityPostRow[];

    return (
        <section className="card-static" style={{ padding: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.8rem" }}>커뮤니티 관리</h2>
            {error ? (
                <p style={{ color: "var(--color-rose-600)", fontSize: "0.9rem" }}>데이터를 불러오지 못했습니다: {error.message}</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {posts.map((post) => (
                        <div key={post.id} style={{ display: "grid", gridTemplateColumns: "8rem 1fr 10rem 10rem", gap: "0.6rem", alignItems: "center", border: "1px solid var(--color-slate-200)", borderRadius: "0.65rem", padding: "0.65rem" }}>
                            <span className="badge">{post.board?.name || "미분류"}</span>
                            <Link href={`/community/${post.board?.slug || ""}/${post.id}`} style={{ textDecoration: "none", color: "var(--color-slate-900)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {post.title}
                            </Link>
                            <span style={{ fontSize: "0.85rem", color: "var(--color-slate-600)" }}>
                                {post.profile?.name || post.profile?.email?.split("@")[0] || "익명"}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: "var(--color-slate-500)" }}>
                                {new Date(post.created_at).toLocaleString("ko-KR")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
