import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import HeaderStats from "@/components/shared/HeaderStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "커뮤니티 - 티꿀모아",
    description: "다양한 주제로 소통하고 정보를 나누는 공간입니다",
};

const BOARD_ICONS: Record<string, string> = {
    exchange: "🤝",
    market: "🛒",
    winners: "🎉",
    anonymous: "🎭",
    minigame: "🎮",
};

export default async function CommunityPage() {
    const supabase = await createClient();

    const { data: boards } = await supabase
        .from("boards")
        .select("*")
        .order("id");

    const { count: totalPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

    // Today's best posts
    const today = new Date().toISOString().split("T")[0];
    const { data: todayPosts } = await supabase
        .from("posts")
        .select("*, board:boards(*), profile:profiles(*)")
        .gte("created_at", today)
        .order("created_at", { ascending: false })
        .limit(5);

    // Recent posts
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("*, board:boards(*), profile:profiles(*)")
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="dash-wrap">
            <HeaderStats
                titleSmall="TinyHoney Community"
                title="커뮤니티"
                subtitle="다양한 주제로 소통하고 정보를 나누는 공간입니다"
                stats={[
                    { label: "게시판", value: boards?.length || 0 },
                    { label: "전체 글", value: totalPosts || 0 },
                ]}
            />

            {/* Board Pills */}
            {boards && boards.length > 0 && (
                <section className="pill-row">
                    {boards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/community/${board.slug}`}
                            className="pill"
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                            <span style={{ fontSize: "1.25rem" }}>{BOARD_ICONS[board.slug] || "💬"}</span>
                            {board.name}
                        </Link>
                    ))}
                </section>
            )}

            {/* 2-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Today's Best */}
                <section className="card-static" style={{ padding: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-slate-900)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-amber-500)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        오늘의 BEST
                    </h2>

                    {todayPosts && todayPosts.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {todayPosts.map((post, idx) => (
                                <Link
                                    key={post.id}
                                    href={`/community/${post.board?.slug}/${post.id}`}
                                    style={{ display: "flex", gap: "0.75rem", padding: "0.875rem", background: "var(--color-slate-50)", borderRadius: "0.5rem", textDecoration: "none", color: "inherit", transition: "all 0.2s", border: "1px solid var(--color-slate-100)" }}
                                >
                                    <div style={{ flex: "0 0 auto", width: "2rem", height: "2rem", background: "linear-gradient(135deg, var(--color-amber-400) 0%, var(--color-amber-500) 100%)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "0.875rem" }}>
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                            <span className="badge" style={{ fontSize: "0.75rem" }}>{post.board?.name}</span>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-slate-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {post.title}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--color-slate-500)" }}>
                                            <span>{post.profile?.name || post.profile?.email?.split("@")[0] || "익명"}</span>
                                            <span>·</span>
                                            <span>{timeAgo(post.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-slate-400)" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
                            <p style={{ fontSize: "0.9375rem", fontWeight: 600 }}>오늘 작성된 글이 없습니다</p>
                        </div>
                    )}
                </section>

                {/* Recent Posts */}
                <section className="card-static" style={{ padding: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-slate-900)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-emerald-500)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        최근 게시글
                    </h2>

                    {recentPosts && recentPosts.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/community/${post.board?.slug}/${post.id}`}
                                    style={{ display: "flex", gap: "0.75rem", padding: "0.875rem", background: "var(--color-slate-50)", borderRadius: "0.5rem", textDecoration: "none", color: "inherit", transition: "all 0.2s", border: "1px solid var(--color-slate-100)" }}
                                >
                                    <div style={{ flex: "0 0 auto", width: "2rem", height: "2rem", background: "var(--color-slate-200)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                                        {BOARD_ICONS[post.board?.slug] || "💬"}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                            <span className="badge" style={{ fontSize: "0.75rem" }}>{post.board?.name}</span>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-slate-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {post.title}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--color-slate-500)" }}>
                                            <span>{post.profile?.name || post.profile?.email?.split("@")[0] || "익명"}</span>
                                            <span>·</span>
                                            <span>{timeAgo(post.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-slate-400)" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                            <p style={{ fontSize: "0.9375rem", fontWeight: 600 }}>아직 게시글이 없습니다</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Board quick links */}
            {boards && boards.length > 0 && (
                <section className="card-static" style={{ padding: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-slate-900)", marginBottom: "1rem" }}>게시판 바로가기</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                        {boards.map((board) => (
                            <Link
                                key={board.id}
                                href={`/community/${board.slug}`}
                                className="card"
                                style={{ textDecoration: "none", color: "inherit", padding: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", transition: "all 0.2s" }}
                            >
                                <div style={{ width: "2.5rem", height: "2.5rem", background: "linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-amber-200) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
                                    {BOARD_ICONS[board.slug] || "💬"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: "0.125rem" }}>{board.name}</div>
                                    <div style={{ fontSize: "0.8125rem", color: "var(--color-slate-500)" }}>{board.description || "게시판"}</div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-slate-400)", flexShrink: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
