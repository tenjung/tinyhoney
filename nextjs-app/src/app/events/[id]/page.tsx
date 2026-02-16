import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { daysLeft, parsePrizeTags } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: event } = await supabase.from("events").select("title").eq("id", id).single();
    return { title: event ? `${event.title} - 티꿀모아` : "이벤트 상세" };
}

export default async function EventDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (!event) notFound();

    const dl = event.end_date ? daysLeft(event.end_date) : null;
    const prizes = parsePrizeTags(event.prize_tags);

    return (
        <div className="dash-wrap">
            {/* Back */}
            <div style={{ marginBottom: "1rem" }}>
                <Link href="/events" className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: "0.25rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    목록으로
                </Link>
            </div>

            <article className="card-static" style={{ padding: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-slate-900)", marginBottom: "2rem", lineHeight: 1.3 }}>
                    {event.title}
                </h1>

                {/* 2-column layout */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {/* Thumbnail */}
                    <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "400px" }}>
                        {event.thumbnail_url ? (
                            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "1rem", overflow: "hidden", background: "var(--color-slate-100)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={event.thumbnail_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={event.title} />
                            </div>
                        ) : (
                            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "1rem", background: "var(--color-slate-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                                🎁
                            </div>
                        )}
                    </div>

                    {/* Meta table */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{ background: "var(--color-slate-50)", borderRadius: "0.75rem", padding: "1.5rem", height: "100%" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    {event.organizer && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)", width: "120px" }}>주최사</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>{event.organizer}</td>
                                        </tr>
                                    )}
                                    {event.start_date && event.end_date && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>응모기간</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>
                                                {new Date(event.start_date).toLocaleDateString("ko-KR")} ~ {new Date(event.end_date).toLocaleDateString("ko-KR")}
                                                {dl !== null && dl >= 0 && dl <= 3 && (
                                                    <span className="badge" style={{ marginLeft: "0.5rem", borderColor: "var(--color-rose-500)", background: "var(--color-rose-50)", color: "var(--color-rose-700)" }}>⏰ D-{dl}</span>
                                                )}
                                                {dl !== null && dl > 3 && (
                                                    <span className="badge" style={{ marginLeft: "0.5rem", borderColor: "var(--color-emerald-500)", background: "var(--color-emerald-50)", color: "var(--color-emerald-700)" }}>진행중</span>
                                                )}
                                                {dl !== null && dl < 0 && (
                                                    <span className="badge" style={{ marginLeft: "0.5rem", borderColor: "var(--color-slate-300)", background: "var(--color-slate-100)", color: "var(--color-slate-500)" }}>종료</span>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {event.entry_type && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>응모형태</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>{event.entry_type}</td>
                                        </tr>
                                    )}
                                    {event.announcement_date && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>당첨자 발표일</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>
                                                {new Date(event.announcement_date).toLocaleDateString("ko-KR")}
                                            </td>
                                        </tr>
                                    )}
                                    {event.winner_count > 0 && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>총 당첨자수</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-emerald-600)" }}>{event.winner_count}명</td>
                                        </tr>
                                    )}
                                    {prizes.length > 0 && (
                                        <tr>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)", verticalAlign: "top" }}>경품태그</td>
                                            <td style={{ padding: "0.75rem 1rem" }}>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                    {prizes.map((prize) => (
                                                        <span key={prize} className="badge badge-amber" style={{ fontSize: "0.8125rem", padding: "0.25rem 0.625rem" }}>{prize}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                {event.url && (
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
                        <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: "var(--color-amber-500)", borderColor: "var(--color-amber-500)", fontSize: "1rem", padding: "0.875rem 2.5rem", fontWeight: 700, height: "auto" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: "0.5rem" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            이벤트 참여하기
                        </a>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: "1rem" }}>이벤트 상세</h2>
                        <div style={{ background: "white", border: "1px solid var(--color-slate-200)", borderRadius: "0.75rem", padding: "1.5rem", whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--color-slate-700)", fontSize: "0.9375rem" }}>
                            {event.description}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
