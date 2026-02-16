import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEventsPage() {
    const supabase = await createClient();
    const { data: events, error } = await supabase
        .from("events")
        .select("id, title, organizer, end_date, created_at")
        .order("created_at", { ascending: false })
        .limit(60);

    return (
        <section className="card-static" style={{ padding: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.8rem" }}>이벤트 관리</h2>
            {error ? (
                <p style={{ color: "var(--color-rose-600)", fontSize: "0.9rem" }}>데이터를 불러오지 못했습니다: {error.message}</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {(events || []).map((event) => (
                        <div key={event.id} style={{ display: "grid", gridTemplateColumns: "1fr 10rem 10rem 10rem", gap: "0.6rem", alignItems: "center", border: "1px solid var(--color-slate-200)", borderRadius: "0.65rem", padding: "0.65rem" }}>
                            <Link href={`/events/${event.id}`} style={{ textDecoration: "none", color: "var(--color-slate-900)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {event.title}
                            </Link>
                            <span style={{ fontSize: "0.85rem", color: "var(--color-slate-600)" }}>{event.organizer || "-"}</span>
                            <span style={{ fontSize: "0.85rem", color: "var(--color-slate-600)" }}>{event.end_date || "-"}</span>
                            <span style={{ fontSize: "0.82rem", color: "var(--color-slate-500)" }}>
                                {new Date(event.created_at).toLocaleString("ko-KR")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
