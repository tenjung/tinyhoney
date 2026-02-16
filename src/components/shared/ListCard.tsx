import Link from "next/link";
import type { Deal, Event } from "@/types/database";
import { formatPrice, timeAgo, daysLeft, parsePrizeTags } from "@/lib/utils";

interface ListCardProps {
    item: Deal | Event;
    type: "deal" | "event";
    detailPath: string;
}

function isDeal(item: Deal | Event): item is Deal {
    return "source" in item;
}

export default function ListCard({ item, type, detailPath }: ListCardProps) {
    const thumbnailUrl = item.thumbnail_url || "";
    const hasImage =
        thumbnailUrl.startsWith("http") ||
        thumbnailUrl.startsWith("//") ||
        thumbnailUrl.startsWith("/");

    return (
        <Link href={detailPath} className="card deal-card" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            {/* Thumbnail */}
            <div className="deal-thumb">
                {hasImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnailUrl} alt={item.title} loading="lazy" />
                ) : (
                    <div className="deal-thumb-empty">{type === "event" ? "🎁" : "📦"}</div>
                )}
            </div>

            {/* Info */}
            <div className="deal-info">
                {/* Tags */}
                <div className="deal-tags">
                    {isDeal(item) ? (
                        <>
                            {item.is_lowest && <span className="badge badge-amber">🐝 허니픽</span>}
                            {item.category && <span className="badge">{item.category}</span>}
                            {item.shop_name && <span className="badge">{item.shop_name}</span>}
                            <span className="badge badge-source">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {item.source}
                            </span>
                        </>
                    ) : (
                        <>
                            {(item as Event).platform_type && <span className="badge">{(item as Event).platform_type}</span>}
                            {(item as Event).organizer && <span className="badge">{(item as Event).organizer}</span>}
                            {(item as Event).end_date && (() => {
                                const dl = daysLeft((item as Event).end_date!);
                                if (dl < 0) return <span className="badge" style={{ borderColor: "var(--color-slate-300)", background: "var(--color-slate-100)", color: "var(--color-slate-500)", fontWeight: 600 }}>종료</span>;
                                if (dl <= 3) return <span className="badge" style={{ borderColor: "var(--color-rose-500)", background: "var(--color-rose-50)", color: "var(--color-rose-700)", fontWeight: 700 }}>⏰ D-{dl}</span>;
                                return <span className="badge badge-source">진행중</span>;
                            })()}
                        </>
                    )}
                </div>

                {/* Title */}
                <h2 className="deal-title" style={{ color: "var(--color-slate-900)" }}>
                    {item.title}
                </h2>

                {/* Meta */}
                <div className="deal-meta">
                    {isDeal(item) ? (
                        <>
                            {item.price > 0 && <span className="deal-price">{formatPrice(item.price)}</span>}
                            <span className="deal-shipping">
                                {item.shipping_fee === 0 ? "배송 무료" : `배송 ${formatPrice(item.shipping_fee)}`}
                            </span>
                            {item.posted_at && <span className="deal-time">{timeAgo(item.posted_at)}전</span>}
                        </>
                    ) : (
                        <>
                            {(item as Event).start_date && (item as Event).end_date && (
                                <span className="deal-shipping">
                                    📅 {new Date((item as Event).start_date!).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })} ~ {new Date((item as Event).end_date!).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                                </span>
                            )}
                            {(item as Event).winner_count > 0 && (
                                <span className="deal-time">🎁 총 {(item as Event).winner_count}명</span>
                            )}
                            {(item as Event).entry_type && (
                                <span className="deal-shipping">{(item as Event).entry_type}</span>
                            )}
                            {(item as Event).prize_tags && (
                                parsePrizeTags((item as Event).prize_tags).slice(0, 2).map((prize) => (
                                    <span key={prize} className="badge badge-amber">{prize}</span>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
