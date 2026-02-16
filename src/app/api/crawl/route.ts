import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ALL_CRAWLERS, getCrawler, executeCrawler } from "@/lib/crawlers";
import type { CrawlResult } from "@/lib/crawlers";

/**
 * Vercel Cron Job: 핫딜 크롤러 API
 *
 * 실행방법:
 * - 전체: GET /api/crawl (Authorization: Bearer CRON_SECRET)
 * - 단일: GET /api/crawl?source=FMKOREA
 */

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { db: { schema: "tinyhoney" } }
    );
}

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const sourceFilter = searchParams.get("source");

    // 단일 크롤러 실행
    if (sourceFilter) {
        const crawler = getCrawler(sourceFilter.toUpperCase());
        if (!crawler) {
            return NextResponse.json(
                { error: `Unknown source: ${sourceFilter}` },
                { status: 400 }
            );
        }
        const result = await executeCrawler(crawler, supabase);
        return NextResponse.json({
            success: !result.error,
            timestamp: new Date().toISOString(),
            results: [result],
        });
    }

    // 전체 크롤러 실행
    const results: CrawlResult[] = [];

    for (const crawler of ALL_CRAWLERS) {
        const result = await executeCrawler(crawler, supabase);
        results.push(result);
        console.log(
            `[Crawler] ${crawler.name}: found=${result.found} inserted=${result.inserted}${result.error ? ` error=${result.error}` : ""}`
        );
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results,
    });
}
