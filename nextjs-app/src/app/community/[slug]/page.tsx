import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import HeaderStats from "@/components/shared/HeaderStats";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: board } = await supabase.from("boards").select("name").eq("slug", slug).single();
    return { title: board ? `${board.name} - 티꿀모아 커뮤니티` : "게시판" };
}

export default async function BoardDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: board } = await supabase
        .from("boards")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!board) notFound();

    const { data: posts, count } = await supabase
        .from("posts")
        .select("*, profile:profiles(*)", { count: "exact" })
        .eq("board_id", board.id)
        .order("created_at", { ascending: false })
        .limit(20);

    return (
        <div className="dash-wrap">
            <HeaderStats
                titleSmall="TinyHoney Community"
                title={board.name}
                subtitle={board.description || "커뮤니티 게시판"}
                stats={[{ label: "게시글", value: count || 0 }]}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href={`/community/${slug}/new`} className="btn btn-primary">
                    ✏️ 글쓰기
                </Link>
            </div>

            {posts && posts.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/community/${slug}/${post.id}`}
                            className="card"
                            style={{ padding: "1rem 1.25rem", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "1rem" }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>
                                    {post.title}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--color-slate-500)" }}>
                                    <span>{post.profile?.name || post.profile?.email?.split("@")[0] || "익명"}</span>
                                    <span>·</span>
                                    <span>{timeAgo(post.created_at)}</span>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-slate-400)", flexShrink: 0 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            ) : (
                <section className="card-static empty-state">
                    <div className="icon">📝</div>
                    <h3>아직 게시글이 없습니다</h3>
                    <p>첫 번째 글을 작성해보세요!</p>
                </section>
            )}
        </div>
    );
}
