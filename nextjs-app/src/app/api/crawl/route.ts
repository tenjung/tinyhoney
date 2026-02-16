import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron Job: 핫딜 크롤러
// vercel.json에 cron 설정: "schedule": "every 10 minutes"
// 환경변수: CRON_SECRET (Vercel Cron 인증)

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* ── 크롤러 설정 ── */
interface CrawlerConfig {
    name: string;
    source: string;
    url: string;
    parseList: (html: string) => ParsedDeal[];
}

interface ParsedDeal {
    title: string;
    url: string;
    price: number;
    category: string | null;
    thumbnail_url: string | null;
    shop_name: string | null;
}

/* ── HTML 파싱 유틸 ── */
function extractText(html: string, regex: RegExp): string | null {
    const match = html.match(regex);
    return match ? match[1].trim() : null;
}

function extractNumber(text: string | null): number {
    if (!text) return 0;
    const cleaned = text.replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
}

/* ── 뽐뿌 크롤러 ── */
const ppomppuCrawler: CrawlerConfig = {
    name: "뽐뿌",
    source: "PPOMPPU",
    url: "https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu",
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];
        // 뽐뿌 게시글 행 추출
        const rowRegex = /<tr[^>]*class="[^"]*list[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;
        while ((rowMatch = rowRegex.exec(html)) !== null) {
            const row = rowMatch[1];
            const titleMatch = row.match(/<a[^>]*href="([^"]*)"[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
            if (!titleMatch) continue;

            const href = titleMatch[1];
            const title = titleMatch[2].replace(/<[^>]*>/g, "").trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http")
                ? href
                : `https://www.ppomppu.co.kr/zboard/${href}`;

            const priceText = extractText(row, /(\d[\d,]*)\s*원/);
            const imgMatch = row.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
            const thumbnailUrl = imgMatch?.[1] || null;

            deals.push({
                title,
                url,
                price: extractNumber(priceText),
                category: null,
                thumbnail_url: thumbnailUrl,
                shop_name: null,
            });
        }
        return deals;
    },
};

/* ── 루리웹 크롤러 ── */
const ruliwebCrawler: CrawlerConfig = {
    name: "루리웹",
    source: "RULIWEB",
    url: "https://bbs.ruliweb.com/market/board/1020",
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];
        const rowRegex = /<tr[^>]*class="[^"]*table_body[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;
        while ((rowMatch = rowRegex.exec(html)) !== null) {
            const row = rowMatch[1];
            const titleMatch = row.match(/<a[^>]*href="([^"]*)"[^>]*class="[^"]*subject[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
                || row.match(/<a[^>]*class="[^"]*subject[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
            if (!titleMatch) continue;

            const title = titleMatch[2].replace(/<[^>]*>/g, "").trim();
            if (!title || title.length < 3) continue;

            const url = titleMatch[1].startsWith("http")
                ? titleMatch[1]
                : `https://bbs.ruliweb.com${titleMatch[1]}`;

            deals.push({
                title,
                url,
                price: 0,
                category: null,
                thumbnail_url: null,
                shop_name: null,
            });
        }
        return deals;
    },
};

/* ── 퀘이사존 크롤러 ── */
const quasarzoneCrawler: CrawlerConfig = {
    name: "퀘이사존",
    source: "QUASARZONE",
    url: "https://quasarzone.com/bbs/qb_saleinfo",
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];
        const itemRegex = /<div[^>]*class="[^"]*market-info-list[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
        let itemMatch;
        while ((itemMatch = itemRegex.exec(html)) !== null) {
            const item = itemMatch[1];
            const titleMatch = item.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
            if (!titleMatch) continue;

            const title = titleMatch[2].replace(/<[^>]*>/g, "").trim();
            if (!title || title.length < 3) continue;

            const url = titleMatch[1].startsWith("http")
                ? titleMatch[1]
                : `https://quasarzone.com${titleMatch[1]}`;

            const priceText = extractText(item, /(\d[\d,]*)\s*원/);

            deals.push({
                title,
                url,
                price: extractNumber(priceText),
                category: null,
                thumbnail_url: null,
                shop_name: null,
            });
        }
        return deals;
    },
};

const CRAWLERS: CrawlerConfig[] = [ppomppuCrawler, ruliwebCrawler, quasarzoneCrawler];

/* ── Fetch HTML ── */
async function fetchHTML(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

/* ── Main handler ── */
export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: { source: string; found: number; inserted: number; error?: string }[] = [];

    for (const crawler of CRAWLERS) {
        try {
            const html = await fetchHTML(crawler.url);
            if (!html) {
                results.push({ source: crawler.source, found: 0, inserted: 0, error: "Failed to fetch" });
                continue;
            }

            const parsedDeals = crawler.parseList(html);
            let inserted = 0;

            for (const deal of parsedDeals) {
                // Upsert: skip if URL already exists
                const { error } = await supabase.from("deals").upsert(
                    {
                        title: deal.title,
                        url: deal.url,
                        source: crawler.source,
                        price: deal.price,
                        category: deal.category,
                        thumbnail_url: deal.thumbnail_url,
                        shop_name: deal.shop_name,
                        posted_at: new Date().toISOString(),
                        is_lowest: false,
                    },
                    { onConflict: "url", ignoreDuplicates: true }
                );
                if (!error) inserted++;

                // Price history
                if (deal.price > 0) {
                    const { data: existing } = await supabase
                        .from("deals")
                        .select("id")
                        .eq("url", deal.url)
                        .single();

                    if (existing) {
                        await supabase.from("price_histories").insert({
                            deal_id: existing.id,
                            recorded_price: deal.price,
                        });
                    }
                }
            }

            results.push({ source: crawler.source, found: parsedDeals.length, inserted });
        } catch (err) {
            results.push({
                source: crawler.source,
                found: 0,
                inserted: 0,
                error: err instanceof Error ? err.message : "Unknown error",
            });
        }
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results,
    });
}
