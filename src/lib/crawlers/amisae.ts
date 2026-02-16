import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 어미새 핫딜 크롤러
 *
 * 구조: XpressEngine 기반 (FM코리아와 유사한 가능성)
 * 안티봇: Cloudflare 보호 가능성 있음 — 실패 시 graceful skip
 */
const amisaeCrawler: CrawlerConfig = {
    name: "어미새",
    source: "AMISAE",
    url: "https://eomisae.co.kr/hotdeal",
    headers: {
        Referer: "https://eomisae.co.kr/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];

        // XpressEngine 기반 리스트 (li 또는 div)
        const itemRegex = /<li[^>]*class="[^"]*li[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
        let itemMatch;

        while ((itemMatch = itemRegex.exec(html)) !== null) {
            const item = itemMatch[1];

            // 제목 + 링크
            const titleMatch = item.match(
                /<a[^>]*href="(\/\d+|https:\/\/eomisae\.co\.kr\/\d+)"[^>]*>([\s\S]*?)<\/a>/i
            );
            if (!titleMatch) continue;

            const href = titleMatch[1];
            const title = decodeEntities(stripTags(titleMatch[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http")
                ? href
                : `https://eomisae.co.kr${href}`;

            // 가격
            const priceText = item.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 쇼핑몰
            const shopMatch = item.match(/class="[^"]*shop[^"]*"[^>]*>([^<]+)</i);
            const shopName = shopMatch ? stripTags(shopMatch[1]).trim() : null;

            // 카테고리
            const categoryMatch = item.match(/class="[^"]*cate[^"]*"[^>]*>([^<]+)</i);
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 썸네일
            const thumbMatch = item.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
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

export default amisaeCrawler;
