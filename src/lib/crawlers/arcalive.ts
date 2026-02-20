import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 아카라이브 핫딜 크롤러
 *
 * 참고: 서버 환경에서 Cloudflare 챌린지로 403이 발생할 수 있음.
 * 응답을 정상 수신한 경우 /b/hotdeal/{id} 링크를 기준으로 파싱한다.
 */
const arcaliveCrawler: CrawlerConfig = {
    name: "아카라이브",
    source: "ARCALIVE",
    url: "https://arca.live/b/hotdeal",
    headers: {
        Referer: "https://arca.live/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];
        const seen = new Set<string>();

        const linkRegex =
            /<a[^>]*href="(\/b\/hotdeal\/\d+|https:\/\/arca\.live\/b\/hotdeal\/\d+[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
        let match;

        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1];
            const title = decodeEntities(stripTags(match[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http") ? href : `https://arca.live${href}`;
            if (seen.has(url)) continue;
            seen.add(url);

            const priceText = title.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            deals.push({
                title,
                url,
                price,
                category: null,
                thumbnail_url: null,
                shop_name: null,
            });
        }

        return deals;
    },
};

export default arcaliveCrawler;
