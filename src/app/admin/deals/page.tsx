import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DealManagementActions from "@/components/admin/DealManagementActions";
import { isDealsSchemaOutdated } from "@/lib/supabase/deals-schema";

interface PageProps {
    searchParams: Promise<{ q?: string; visibility?: string; source?: string }>;
}

const VISIBILITY_FILTERS: Array<{ label: string; hrefValue: string | null }> = [
    { label: "전체", hrefValue: null },
    { label: "노출", hrefValue: "visible" },
    { label: "숨김", hrefValue: "hidden" },
];

function buildFilterHref(
    visibility: string | null,
    q?: string,
    source?: string
) {
    const params = new URLSearchParams();
    if (visibility) params.set("visibility", visibility);
    if (q) params.set("q", q);
    if (source) params.set("source", source);

    const query = params.toString();
    return query ? `/admin/deals?${query}` : "/admin/deals";
}

export default async function AdminDealsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const q = (params.q || "").trim();
    const visibility = params.visibility === "hidden" ? "hidden" : params.visibility === "visible" ? "visible" : "all";
    const source = (params.source || "").trim();

    const supabase = await createClient();
    let query = supabase
        .from("deals")
        .select("id, title, source, price, created_at, is_hidden, is_lowest, admin_note")
        .order("created_at", { ascending: false })
        .limit(80);

    if (q) {
        query = query.ilike("title", `%${q}%`);
    }
    if (source) {
        query = query.eq("source", source);
    }
    if (visibility === "hidden") {
        query = query.eq("is_hidden", true);
    }
    if (visibility === "visible") {
        query = query.eq("is_hidden", false);
    }

    const { data: fetchedDeals, error: initialError } = await query;
    let deals = fetchedDeals;
    let error = initialError;
    const schemaOutdated = isDealsSchemaOutdated(initialError?.message);

    if (schemaOutdated) {
        const fallback = await supabase
            .from("deals")
            .select("id, title, source, price, created_at, is_lowest")
            .order("created_at", { ascending: false })
            .limit(80);

        deals = (fallback.data || []).map((deal) => ({
            ...deal,
            is_hidden: false,
            admin_note: null,
        }));
        error = fallback.error;
    }

    return (
        <section className="card-static" style={{ padding: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.2rem" }}>핫딜 관리</h2>
            <p style={{ fontSize: "0.84rem", color: "var(--color-slate-500)", marginBottom: "0.8rem" }}>
                노출/숨김, 허니픽 여부, 관리자 메모를 이 화면에서 바로 관리합니다.
            </p>
            {schemaOutdated && (
                <p
                    style={{
                        marginBottom: "0.65rem",
                        fontSize: "0.84rem",
                        color: "var(--color-amber-700)",
                        background: "var(--color-amber-50)",
                        border: "1px solid var(--color-amber-300)",
                        borderRadius: "0.55rem",
                        padding: "0.55rem 0.65rem",
                    }}
                >
                    DB 마이그레이션이 적용되지 않아 읽기 전용으로 표시 중입니다. `supabase/migrations/20260216234500_add_admin_fields_to_deals.sql`를 적용해 주세요.
                </p>
            )}

            <form method="get" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.45rem", marginBottom: "0.75rem" }}>
                {visibility !== "all" && <input type="hidden" name="visibility" value={visibility} />}
                {source && <input type="hidden" name="source" value={source} />}
                <input
                    className="input"
                    name="q"
                    defaultValue={q}
                    placeholder="핫딜 제목 검색"
                    style={{ height: "2rem", fontSize: "0.83rem" }}
                />
                <button className="btn btn-primary" style={{ height: "2rem", fontSize: "0.82rem", padding: "0 0.8rem" }}>
                    검색
                </button>
            </form>

            <div className="pill-row" style={{ marginBottom: "0.85rem" }}>
                {VISIBILITY_FILTERS.map((filter) => {
                    const active =
                        (filter.hrefValue === null && visibility === "all") ||
                        filter.hrefValue === visibility;

                    return (
                        <Link
                            key={filter.label}
                            href={buildFilterHref(filter.hrefValue, q, source)}
                            className={`pill ${active ? "pill-active" : ""}`}
                        >
                            {filter.label}
                        </Link>
                    );
                })}
            </div>

            {error ? (
                <p style={{ color: "var(--color-rose-600)", fontSize: "0.9rem" }}>
                    데이터를 불러오지 못했습니다: {error.message}
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {(deals || []).map((deal) => (
                        <div
                            key={deal.id}
                            style={{
                                border: "1px solid var(--color-slate-200)",
                                borderRadius: "0.65rem",
                                padding: "0.65rem",
                                display: "grid",
                                gap: "0.5rem",
                            }}
                        >
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                {deal.is_lowest && <span className="badge badge-amber">허니픽</span>}
                                <span className="badge">{deal.source}</span>
                                <span
                                    className="badge"
                                    style={
                                        deal.is_hidden
                                            ? {
                                                  borderColor: "var(--color-rose-500)",
                                                  background: "var(--color-rose-50)",
                                                  color: "var(--color-rose-700)",
                                              }
                                            : {
                                                  borderColor: "var(--color-emerald-500)",
                                                  background: "var(--color-emerald-50)",
                                                  color: "var(--color-emerald-700)",
                                              }
                                    }
                                >
                                    {deal.is_hidden ? "숨김" : "노출"}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr",
                                    gap: "0.55rem",
                                    alignItems: "start",
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <Link
                                        href={`/deals/${deal.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "var(--color-slate-900)",
                                            fontWeight: 800,
                                            display: "block",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {deal.title}
                                    </Link>
                                    <p style={{ marginTop: "0.35rem", fontSize: "0.82rem", color: "var(--color-slate-500)" }}>
                                        가격 {deal.price.toLocaleString()}원 · 수집 {new Date(deal.created_at).toLocaleString("ko-KR")}
                                    </p>
                                </div>
                                {schemaOutdated ? (
                                    <p style={{ fontSize: "0.78rem", color: "var(--color-slate-500)" }}>
                                        마이그레이션 적용 후 관리 버튼이 활성화됩니다.
                                    </p>
                                ) : (
                                    <DealManagementActions
                                        dealId={deal.id}
                                        initialHidden={deal.is_hidden}
                                        initialLowest={deal.is_lowest}
                                        initialAdminNote={deal.admin_note}
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    {(!deals || deals.length === 0) && (
                        <p style={{ fontSize: "0.86rem", color: "var(--color-slate-500)", padding: "1rem 0.3rem" }}>
                            조건에 맞는 핫딜이 없습니다.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
