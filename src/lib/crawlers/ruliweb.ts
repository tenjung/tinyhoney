import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 루리웹 핫딜 크롤러
 *
 * 구조: <tr class="table_body"> 테이블 행 기반
 * 카테고리: 게임S/W, 게임H/W, PC/가전, A/V, VR, 음식, 의류, 상품권 등
 */
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

            // 제목 + 링크 (subject 클래스 링크)
            const titleMatch = row.match(
                /<a[^>]*href="([^"]*)"[^>]*class="[^"]*subject[^"]*"[^>]*>([\s\S]*?)<\/a>/i
            ) || row.match(
                /<a[^>]*class="[^"]*subject[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i
            );
            if (!titleMatch) continue;

            const title = decodeEntities(stripTags(titleMatch[2])).trim();
            if (!title || title.length < 3) continue;

            const url = titleMatch[1].startsWith("http")
                ? titleMatch[1]
                : `https://bbs.ruliweb.com${titleMatch[1]}`;

            // 카테고리 (disp_cat_s 클래스)
            const categoryMatch = row.match(
                /class="[^"]*disp_cat_s[^"]*"[^>]*>([^<]+)</i
            ) || row.match(
                /cate=\d+[^>]*>([^<]+)</i
            );
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 가격 (제목에서 추출)
            const priceText = title.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 썸네일
            const thumbMatch = row.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
            const thumbnailUrl = thumbMatch ? thumbMatch[1] : null;

            deals.push({
                title,
                url,
                price,
                category,
                thumbnail_url: thumbnailUrl,
                shop_name: null,
            });
        }

        return deals;
    },
};

export default ruliwebCrawler;
