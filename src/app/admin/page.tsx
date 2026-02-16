import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const [{ count: deals }, { count: events }, { count: posts }, { count: profiles }] = await Promise.all([
        supabase.from("deals").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    const cards = [
        { label: "핫딜", value: deals || 0, href: "/admin/deals" },
        { label: "이벤트", value: events || 0, href: "/admin/events" },
        { label: "커뮤니티 글", value: posts || 0, href: "/admin/community" },
        { label: "회원/등록", value: profiles || 0, href: "/admin/registrations" },
    ];

    return (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
            {cards.map((card) => (
                <Link key={card.label} href={card.href} className="card-static" style={{ textDecoration: "none", color: "inherit", padding: "1.1rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-slate-500)", marginBottom: "0.4rem" }}>{card.label}</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 900 }}>{card.value.toLocaleString()}</p>
                </Link>
            ))}
        </section>
    );
}
