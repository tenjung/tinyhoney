import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HeaderStats from "@/components/shared/HeaderStats";
import SearchBar from "@/components/shared/SearchBar";
import CategoryPills from "@/components/shared/CategoryPills";
import ListCard from "@/components/shared/ListCard";
import EmptyState from "@/components/shared/EmptyState";
import { DealListSkeleton } from "@/components/shared/Skeleton";
import type { Deal, DealSource } from "@/types/database";

const SOURCES: [string, string | null][] = [
    ["전체", null],
    ["뽐뿌", "PPOMPPU"],
    ["루리웹", "RULIWEB"],
    ["퀘이사존", "QUASARZONE"],
    ["어미새", "AMISAE"],
    ["클리앙", "CLIEN"],
    ["아카라이브", "ARCALIVE"],
    ["FM코리아", "FMKOREA"],
];

interface PageProps {
    searchParams: Promise<{ q?: string; source?: string; lowest?: string; category?: string }>;
}

async function DealsList({ searchParams }: { searchParams: { q?: string; source?: string; lowest?: string; category?: string } }) {
    const supabase = await createClient();

    let query = supabase
        .from("deals")
        .select("*")
        .order("posted_at", { ascending: false })
        .limit(50);

    if (searchParams.q) {
        query = query.ilike("title", `%${searchParams.q}%`);
    }
    if (searchParams.source) {
        query = query.eq("source", searchParams.source);
    }
    if (searchParams.lowest === "1") {
        query = query.eq("is_lowest", true);
    }
    if (searchParams.category) {
        query = query.eq("category", searchParams.category);
    }

    const { data: deals } = await query;

    if (!deals || deals.length === 0) {
        return (
            <EmptyState
                icon="🔍"
                title="검색 결과가 없습니다"
                message="다른 키워드로 검색해보세요"
                buttons={[{ label: "전체 보기", href: "/", primary: true }]}
            />
        );
    }

    return (
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {deals.map((deal: Deal) => (
                <ListCard
                    key={deal.id}
                    item={deal}
                    type="deal"
                    detailPath={`/deals/${deal.id}`}
                />
            ))}
        </section>
    );
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    // Stats
    const { count: totalDeals } = await supabase
        .from("deals")
        .select("*", { count: "exact", head: true });
    const { count: todayDeals } = await supabase
        .from("deals")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]);
    const { count: honeyPicks } = await supabase
        .from("deals")
        .select("*", { count: "exact", head: true })
        .eq("is_lowest", true);

    return (
        <div className="dash-wrap">
            <HeaderStats
                title="실시간 핫딜"
                subtitle="전국 핫딜 커뮤니티를 실시간으로 크롤링하여 모았습니다"
                stats={[
                    { label: "전체", value: totalDeals || 0 },
                    { label: "오늘", value: todayDeals || 0 },
                    { label: "허니픽", value: honeyPicks || 0, color: "var(--color-amber-600)" },
                ]}
            />

            <Suspense fallback={null}>
                <SearchBar
                    placeholder="핫딜 검색..."
                    filters={[
                        {
                            type: "select",
                            name: "category",
                            options: [
                                { label: "전체 카테고리", value: null },
                                { label: "디지털/가전", value: "디지털/가전" },
                                { label: "식품/건강", value: "식품/건강" },
                                { label: "패션/뷰티", value: "패션/뷰티" },
                                { label: "생활/주방", value: "생활/주방" },
                                { label: "여행/문화", value: "여행/문화" },
                            ],
                        },
                        { type: "checkbox", name: "lowest", label: "🐝 허니픽만 보기" },
                    ]}
                />
            </Suspense>

            <Suspense fallback={null}>
                <CategoryPills
                    basePath="/"
                    paramName="source"
                    categories={SOURCES}
                />
            </Suspense>

            <Suspense fallback={<DealListSkeleton count={5} />}>
                <DealsList searchParams={params} />
            </Suspense>
        </div>
    );
}
