import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string; postId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { postId } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase.from("posts").select("title").eq("id", postId).single();
    return { title: post ? `${post.title} - 티꿀모아` : "게시글" };
}

export default async function PostDetailPage({ params }: PageProps) {
    const { slug, postId } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("posts")
        .select("*, profile:profiles(*), board:boards(*)")
        .eq("id", postId)
        .single();

    if (!post) notFound();

    const { data: comments } = await supabase
        .from("comments")
        .select("*, profile:profiles(*)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

    return (
        <div className="dash-wrap">
            <div style={{ marginBottom: "1rem" }}>
                <Link href={`/community/${slug}`} className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: "0.25rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    목록으로
                </Link>
            </div>

            <article className="card-static" style={{ padding: "2rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <span className="badge" style={{ marginBottom: "0.5rem" }}>{post.board?.name}</span>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-slate-900)", lineHeight: 1.3, marginTop: "0.5rem" }}>
                        {post.title}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-slate-500)" }}>
                        <span style={{ fontWeight: 600 }}>{post.profile?.name || post.profile?.email?.split("@")[0] || "익명"}</span>
                        <span>·</span>
                        <span>{timeAgo(post.created_at)}</span>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid var(--color-slate-200)", paddingTop: "1.5rem", whiteSpace: "pre-wrap", lineHeight: 1.8, color: "var(--color-slate-700)", fontSize: "0.9375rem" }}>
                    {post.content}
                </div>
            </article>

            {/* Comments */}
            <section className="card-static" style={{ padding: "1.5rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: "1rem" }}>
                    💬 댓글 {comments?.length || 0}개
                </h2>

                {comments && comments.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {comments.map((comment) => (
                            <div key={comment.id} style={{ padding: "0.75rem", background: "var(--color-slate-50)", borderRadius: "0.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
                                    <span style={{ fontWeight: 600, color: "var(--color-slate-900)" }}>
                                        {comment.profile?.name || comment.profile?.email?.split("@")[0] || "익명"}
                                    </span>
                                    <span style={{ color: "var(--color-slate-400)" }}>·</span>
                                    <span style={{ color: "var(--color-slate-500)" }}>{timeAgo(comment.created_at)}</span>
                                </div>
                                <p style={{ fontSize: "0.875rem", color: "var(--color-slate-700)", lineHeight: 1.6 }}>
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: "0.875rem", color: "var(--color-slate-400)", textAlign: "center", padding: "1rem" }}>
                        아직 댓글이 없습니다
                    </p>
                )}
            </section>
        </div>
    );
}
