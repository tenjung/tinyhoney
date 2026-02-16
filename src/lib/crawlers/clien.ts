import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 클리앙 알뜰구매 크롤러
 *
 * 구조: div.list_item.symph_row 기반 리스트
 * 카테고리: 상품정보 / 이벤트정보 / 해외구매정보
 * 이전 Rails ClienCrawler 로직 기반 재구현
 */
const clienCrawler: CrawlerConfig = {
    name: "클리앙",
    source: "CLIEN",
    url: "https://www.clien.net/service/board/jirum",
    headers: {
        Referer: "https://www.clien.net/",
        Accept: "*/*",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];

        // 클리앙 게시글 행: div.list_item.symph_row
        const rowRegex = /<div[^>]*class="[^"]*list_item\s+symph_row[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(html)) !== null) {
            const row = rowMatch[1];

            // 제목 + 링크
            const titleMatch = row.match(
                /<a[^>]*class="[^"]*list_subject[^"]*"[^>]*href="([^"]*)"[^>]*>[\s\S]*?<span[^>]*class="[^"]*subject_fixed[^"]*"[^>]*>([\s\S]*?)<\/span>/i
            ) || row.match(
                /<a[^>]*href="([^"]*)"[^>]*class="[^"]*list_subject[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*subject_fixed[^"]*"[^>]*>([\s\S]*?)<\/span>/i
            );
            if (!titleMatch) continue;

            const href = titleMatch[1];
            const title = decodeEntities(stripTags(titleMatch[2])).trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http")
                ? href
                : `https://www.clien.net${href}`;

            // 카테고리 (상품정보/이벤트정보/해외구매정보)
            const categoryMatch = row.match(
                /class="[^"]*category[^"]*"[^>]*>([^<]+)</i
            ) || row.match(
                /board\/jirum\?category=\d+[^>]*>([^<]+)</i
            );
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 가격 (제목에서 추출)
            const priceText = title.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 썸네일
            const thumbMatch = row.match(
                /<img[^>]*class="[^"]*list_img[^"]*"[^>]*src="([^"]*)"/i
            ) || row.match(
                /<img[^>]*src="([^"]*)"[^>]*>/i
            );
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

export default clienCrawler;
