import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 뽐뿌 핫딜 크롤러
 *
 * 구조: <tr class="list*"> 테이블 행 기반
 * 특이사항: EUC-KR 인코딩 → TextDecoder 필요
 * 안티봇: User-Agent + Referer + Accept 조합 필요
 */
const ppomppuCrawler: CrawlerConfig = {
    name: "뽐뿌",
    source: "PPOMPPU",
    url: "https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu",
    encoding: "euc-kr",
    headers: {
        Referer: "https://www.ppomppu.co.kr/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];

        // 뽐뿌 게시글 행
        const rowRegex = /<tr[^>]*class="[^"]*list[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(html)) !== null) {
            const row = rowMatch[1];

            // 제목 링크 (title 클래스 또는 baseList-title)
            const titleMatch = row.match(
                /<a[^>]*href="([^"]*)"[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>/i
            ) || row.match(
                /<a[^>]*href="(view[^"]*)"[^>]*>([\s\S]*?)<\/a>/i
            );
            if (!titleMatch) continue;

            const href = titleMatch[1];
            const title = decodeEntities(stripTags(titleMatch[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http")
                ? href
                : `https://www.ppomppu.co.kr/zboard/${href}`;

            // 가격 (제목 또는 행 내 가격)
            const priceText = row.match(/([\d,]+)\s*원/) || title.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 카테고리 (있는 경우)
            const categoryMatch = row.match(/class="[^"]*cate[^"]*"[^>]*>([^<]+)</i);
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 썸네일
            const imgMatch = row.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
            let thumbnailUrl = imgMatch ? imgMatch[1] : null;
            if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
                thumbnailUrl = `https://www.ppomppu.co.kr${thumbnailUrl}`;
            }

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

export default ppomppuCrawler;
