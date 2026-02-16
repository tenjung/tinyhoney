import type { CrawlerConfig, CrawlResult } from "./types";

/**
 * Default browser-like headers to bypass basic anti-bot protection.
 * Individual crawlers can override or extend these.
 */
const DEFAULT_HEADERS: Record<string, string> = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "Upgrade-Insecure-Requests": "1",
};

/* ── HTML parsing utilities ── */

/** Extract the first regex capture group from html */
export function extractText(html: string, regex: RegExp): string | null {
    const match = html.match(regex);
    return match ? match[1].trim() : null;
}

/** Parse a price-like string ("12,345원") into a number */
export function extractNumber(text: string | null): number {
    if (!text) return 0;
    const cleaned = text.replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
}

/** Strip HTML tags from a string */
export function stripTags(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
}

/** Decode HTML entities (&amp; → &, etc.) */
export function decodeEntities(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, " ");
}

/* ── Fetch with retry ── */

export async function fetchHTML(
    url: string,
    options?: { headers?: Record<string, string>; encoding?: string }
): Promise<string | null> {
    const headers = { ...DEFAULT_HEADERS, ...options?.headers };
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(url, {
                headers,
                signal: AbortSignal.timeout(15000),
            });

            if (!res.ok) {
                console.error(`[Crawler] ${url} → HTTP ${res.status} (attempt ${attempt + 1})`);
                if (attempt < maxRetries) {
                    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
                    continue;
                }
                return null;
            }

            // Handle non-UTF-8 encodings (e.g. EUC-KR for 뽐뿌)
            if (options?.encoding && options.encoding !== "utf-8") {
                const buffer = await res.arrayBuffer();
                const decoder = new TextDecoder(options.encoding);
                return decoder.decode(buffer);
            }

            return await res.text();
        } catch (err) {
            console.error(`[Crawler] ${url} → Error (attempt ${attempt + 1}):`, err);
            if (attempt < maxRetries) {
                await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
                continue;
            }
            return null;
        }
    }
    return null;
}

/* ── Execute a single crawler ── */

export async function executeCrawler(
    crawler: CrawlerConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any
): Promise<CrawlResult> {
    try {
        const html = await fetchHTML(crawler.url, {
            headers: crawler.headers,
            encoding: crawler.encoding,
        });

        if (!html) {
            return { source: crawler.source, found: 0, inserted: 0, error: "Failed to fetch" };
        }

        const parsedDeals = crawler.parseList(html);
        let inserted = 0;
        let firstError: string | undefined;

        for (const deal of parsedDeals) {
            // Upsert deal
            const { error } = await supabase.from("deals").upsert(
                {
                    title: deal.title,
                    url: deal.url,
                    source: crawler.source,
                    price: deal.price,
                    original_price: deal.original_price ?? null,
                    shipping_fee: deal.shipping_fee ?? 0,
                    discount_rate: deal.discount_rate ?? null,
                    category: deal.category,
                    thumbnail_url: deal.thumbnail_url,
                    shop_name: deal.shop_name,
                    description: deal.description ?? null,
                    posted_at: new Date().toISOString(),
                    is_lowest: false,
                },
                { onConflict: "url", ignoreDuplicates: true }
            );
            if (!error) {
                inserted++;
            } else {
                if (!firstError) firstError = `${error.code}: ${error.message}`;
                console.error(`[Crawler] Upsert error for "${deal.title}":`, error.message, error.code);
            }

            // Price history tracking
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

        return { source: crawler.source, found: parsedDeals.length, inserted, ...(firstError && { error: firstError }) };
    } catch (err) {
        return {
            source: crawler.source,
            found: 0,
            inserted: 0,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
