import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HeaderStats from "@/components/shared/HeaderStats";
import SearchBar from "@/components/shared/SearchBar";
import CategoryPills from "@/components/shared/CategoryPills";
import ListCard from "@/components/shared/ListCard";
import EmptyState from "@/components/shared/EmptyState";
import { DealListSkeleton } from "@/components/shared/Skeleton";
import type { Event } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "진행 중 이벤트 - 티꿀모아",
    description: "놓치면 후회할 이벤트/경품 행사를 한눈에 모아보세요",
};

const PLATFORM_TYPES: [string, string | null][] = [
    ["전체", null],
    ["네이버", "네이버"],
    ["카카오", "카카오"],
    ["인스타그램", "인스타그램"],
    ["기타", "기타"],
];

interface PageProps {
    searchParams: Promise<{ q?: string; platform_type?: string; tab?: string }>;
}

async function EventsList({ searchParams }: { searchParams: { q?: string; platform_type?: string; tab?: string } }) {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    let query = supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    // Tab filtering
    if (searchParams.tab === "ending") {
        query = query.gte("end_date", today).order("end_date", { ascending: true });
    } else if (searchParams.tab === "ended") {
        query = query.lt("end_date", today);
    } else {
        query = query.gte("end_date", today);
    }

    if (searchParams.q) {
        query = query.ilike("title", `%${searchParams.q}%`);
    }
    if (searchParams.platform_type) {
        query = query.eq("platform_type", searchParams.platform_type);
    }

    const { data: events } = await query;

    if (!events || events.length === 0) {
        return (
            <EmptyState
                icon="🎁"
                title="이벤트가 없습니다"
                message="새로운 이벤트가 등록되면 여기에 표시됩니다"
            />
        );
    }

    return (
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {events.map((event: Event) => (
                <ListCard
                    key={event.id}
                    item={event}
                    type="event"
                    detailPath={`/events/${event.id}`}
                />
            ))}
        </section>
    );
}

export default async function EventsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { count: totalEvents } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });
    const { count: activeEvents } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("end_date", today);

    const tabs: [string, string | null][] = [
        ["진행중", null],
        ["마감임박", "ending"],
        ["종료됨", "ended"],
    ];

    return (
        <div className="dash-wrap">
            <HeaderStats
                titleSmall="TinyHoney Events"
                title="진행 중 이벤트"
                subtitle="놓치면 후회할 이벤트/경품 행사를 한눈에 모아보세요"
                stats={[
                    { label: "전체", value: totalEvents || 0 },
                    { label: "진행중", value: activeEvents || 0, color: "var(--color-emerald-600)" },
                ]}
            />

            <Suspense fallback={null}>
                <SearchBar placeholder="이벤트 검색..." />
            </Suspense>

            <Suspense fallback={null}>
                <CategoryPills basePath="/events" paramName="tab" categories={tabs} />
            </Suspense>

            <Suspense fallback={null}>
                <CategoryPills
                    basePath="/events"
                    paramName="platform_type"
                    categories={PLATFORM_TYPES}
                    extraParams={{ tab: params.tab || null }}
                />
            </Suspense>

            <Suspense fallback={<DealListSkeleton count={5} />}>
                <EventsList searchParams={params} />
            </Suspense>
        </div>
    );
}
