/** Shared types for all crawlers */

export interface ParsedDeal {
    title: string;
    url: string;
    price: number;
    original_price?: number;
    shipping_fee?: number;
    discount_rate?: number;
    category: string | null;
    thumbnail_url: string | null;
    shop_name: string | null;
    description?: string;
}

export interface CrawlResult {
    source: string;
    found: number;
    inserted: number;
    error?: string;
}

export interface CrawlerConfig {
    /** Display name (e.g. "FM코리아") */
    name: string;
    /** Source key matching DB CHECK constraint */
    source: "PPOMPPU" | "RULIWEB" | "QUASARZONE" | "CLIEN" | "FMKOREA" | "AMISAE" | "ARCALIVE";
    /** Target URL to crawl */
    url: string;
    /** Custom headers for anti-bot bypass */
    headers?: Record<string, string>;
    /** Encoding (default: utf-8) */
    encoding?: string;
    /** Parse HTML string and return deals */
    parseList: (html: string) => ParsedDeal[];
}
