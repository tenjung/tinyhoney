import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, timeAgo } from "@/lib/utils";
import type { Metadata } from "next";
import PriceChart from "@/components/deals/PriceChart";
import { isDealsSchemaOutdated } from "@/lib/supabase/deals-schema";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    let { data: deal, error } = await supabase
        .from("deals")
        .select("title")
        .eq("id", id)
        .eq("is_hidden", false)
        .single();

    if (isDealsSchemaOutdated(error?.message)) {
        ({ data: deal } = await supabase
            .from("deals")
            .select("title")
            .eq("id", id)
            .single());
    }

    return { title: deal ? `${deal.title} - 티꿀모아` : "딜 상세" };
}

export default async function DealDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    let { data: deal, error } = await supabase
        .from("deals")
        .select("*, price_histories(*)")
        .eq("id", id)
        .eq("is_hidden", false)
        .single();

    if (isDealsSchemaOutdated(error?.message)) {
        ({ data: deal } = await supabase
            .from("deals")
            .select("*, price_histories(*)")
            .eq("id", id)
            .single());
    }

    if (!deal) notFound();

    const priceHistories = deal.price_histories || [];

    return (
        <div className="dash-wrap">
            {/* Back button */}
            <div style={{ marginBottom: "1rem" }}>
                <Link href="/" className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: "0.25rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    목록으로
                </Link>
            </div>

            {/* Main card */}
            <article className="card-static" style={{ padding: "2rem" }}>
                {/* Tags */}
                <div className="deal-tags" style={{ marginBottom: "1rem" }}>
                    {deal.is_lowest && <span className="badge badge-amber">🐝 허니픽</span>}
                    {deal.category && <span className="badge">{deal.category}</span>}
                    {deal.shop_name && <span className="badge">{deal.shop_name}</span>}
                    <span className="badge badge-source">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {deal.source}
                    </span>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-slate-900)", marginBottom: "2rem", lineHeight: 1.3 }}>
                    {deal.title}
                </h1>

                {/* 2-column: thumbnail + meta */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {/* Thumbnail */}
                    <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "400px" }}>
                        {deal.thumbnail_url ? (
                            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "1rem", overflow: "hidden", background: "var(--color-slate-100)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={deal.thumbnail_url} alt={deal.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        ) : (
                            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "1rem", background: "var(--color-slate-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                                📦
                            </div>
                        )}
                    </div>

                    {/* Meta table */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{ background: "var(--color-slate-50)", borderRadius: "0.75rem", padding: "1.5rem", height: "100%" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)", width: "120px" }}>가격</td>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-rose-600)" }}>
                                            {deal.price > 0 ? formatPrice(deal.price) : "가격정보 없음"}
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>배송비</td>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>
                                            {deal.shipping_fee === 0 ? "무료배송" : formatPrice(deal.shipping_fee)}
                                        </td>
                                    </tr>
                                    {deal.posted_at && (
                                        <tr style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>등록일</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>
                                                {timeAgo(deal.posted_at)}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-slate-500)" }}>출처</td>
                                        <td style={{ padding: "0.75rem 1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-slate-900)" }}>{deal.source}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
                    <a href={deal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: "var(--color-amber-500)", borderColor: "var(--color-amber-500)", fontSize: "1rem", padding: "0.875rem 2.5rem", fontWeight: 700, height: "auto" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: "0.5rem" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        원본 글 보기
                    </a>
                </div>

                {/* Price chart */}
                {priceHistories.length > 1 && (
                    <div>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: "1rem" }}>가격 변동 히스토리</h2>
                        <PriceChart data={priceHistories} />
                    </div>
                )}

                {/* Description */}
                {deal.description && (
                    <div style={{ marginTop: "2rem" }}>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-slate-900)", marginBottom: "1rem" }}>상세 정보</h2>
                        <div style={{ background: "white", border: "1px solid var(--color-slate-200)", borderRadius: "0.75rem", padding: "1.5rem", whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--color-slate-700)", fontSize: "0.9375rem" }}>
                            {deal.description}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
