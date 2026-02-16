import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 퀘이사존 핫딜 크롤러
 *
 * 구조: div.market-info-list 기반
 * 안티봇: User-Agent + sec-fetch 헤더 필요
 */
const quasarzoneCrawler: CrawlerConfig = {
    name: "퀘이사존",
    source: "QUASARZONE",
    url: "https://quasarzone.com/bbs/qb_saleinfo",
    headers: {
        Referer: "https://quasarzone.com/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];

        // 퀘이사존 리스트 아이템
        const itemRegex = /<div[^>]*class="[^"]*market-info-list-[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
        let itemMatch;

        while ((itemMatch = itemRegex.exec(html)) !== null) {
            const item = itemMatch[1];

            // 제목 + 링크
            const titleMatch = item.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
            if (!titleMatch) continue;

            const title = decodeEntities(stripTags(titleMatch[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;

            const href = titleMatch[1];
            const url = href.startsWith("http")
                ? href
                : `https://quasarzone.com${href}`;

            // 가격
            const priceText = item.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 카테고리
            const categoryMatch = item.match(/class="[^"]*category[^"]*"[^>]*>([^<]+)</i);
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 쇼핑몰
            const shopMatch = item.match(/class="[^"]*market[^"]*"[^>]*>([^<]+)</i);
            const shopName = shopMatch ? stripTags(shopMatch[1]).trim() : null;

            // 썸네일
            const thumbMatch = item.match(/<img[^>]*(?:data-src|src)="([^"]*)"[^>]*>/i);
            const thumbnailUrl = thumbMatch ? thumbMatch[1] : null;

            deals.push({
                title,
                url,
                price,
                category,
                thumbnail_url: thumbnailUrl,
                shop_name: shopName,
            });
        }

        return deals;
    },
};

export default quasarzoneCrawler;
