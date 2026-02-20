/**
 * Crawler Registry
 * Central export for all crawlers. Import this in the API route.
 */

import ppomppuCrawler from "./ppomppu";
import ruliwebCrawler from "./ruliweb";
import quasarzoneCrawler from "./quasarzone";
import clienCrawler from "./clien";
import fmkoreaCrawler from "./fmkorea";
import amisaeCrawler from "./amisae";
import arcaliveCrawler from "./arcalive";

import type { CrawlerConfig } from "./types";

/** All enabled crawlers in execution order */
export const ALL_CRAWLERS: CrawlerConfig[] = [
    fmkoreaCrawler,    // 🟢 가장 풍부한 데이터
    clienCrawler,      // 🟢 접근 쉬움
    ruliwebCrawler,    // 🟢 접근 쉬움
    ppomppuCrawler,    // 🟡 EUC-KR + 403 대응
    quasarzoneCrawler, // 🟡 403 대응
    amisaeCrawler,     // 🟡 시도 후 판단
    arcaliveCrawler,   // 🔴 Cloudflare 차단 가능성 높음
];

/** Get a single crawler by source key */
export function getCrawler(source: string): CrawlerConfig | undefined {
    return ALL_CRAWLERS.find((c) => c.source === source);
}

export { executeCrawler, fetchHTML } from "./base";
export type { CrawlerConfig, ParsedDeal, CrawlResult } from "./types";
