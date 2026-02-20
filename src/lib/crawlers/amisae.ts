import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * 어미새 핫딜 크롤러
 *
 * 구조: Rhymix/XE 게시판 table(_listA) 기반
 */
const amisaeCrawler: CrawlerConfig = {
    name: "어미새",
    source: "AMISAE",
    url: "https://eomisae.co.kr/os",
    headers: {
        Referer: "https://eomisae.co.kr/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];
        const seen = new Set<string>();

        // 게시글 링크 파싱 (테이블 + 카드 레이아웃 공통)
        const linkRegex =
            /<a[^>]*class="[^"]*pjax[^"]*"[^>]*href="(\/os\/\d+|https:\/\/eomisae\.co\.kr\/os\/\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
        let linkMatch;

        while ((linkMatch = linkRegex.exec(html)) !== null) {
            const href = linkMatch[1];
            const title = decodeEntities(stripTags(linkMatch[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;
            if (/전체 공개로 전환됩니다|Read More/i.test(title)) continue;

            const url = href.startsWith("http")
                ? href
                : `https://eomisae.co.kr${href}`;
            if (seen.has(url)) continue;
            seen.add(url);

            // 링크 주변 컨텍스트에서 카테고리/썸네일 추출
            const contextStart = Math.max(0, linkMatch.index - 260);
            const contextEnd = Math.min(html.length, linkMatch.index + 320);
            const context = html.slice(contextStart, contextEnd);

            // 카테고리 (국내/해외/네이버 등)
            const categoryMatch = context.match(/<span[^>]*class="[^"]*cate[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
            const category = categoryMatch ? decodeEntities(stripTags(categoryMatch[1])).trim() : null;

            // 공지/광고 제외
            if (category === "공지" || category === "AD" || /공지|이용 규정|상품권 이벤트/.test(title)) {
                continue;
            }

            // 가격 (제목에서 추출)
            const priceText = title.match(/([\d,]+)\s*원/);
            const price = priceText ? extractNumber(priceText[1]) : 0;

            // 쇼핑몰명: [무신사] 형태 태그가 있을 경우 추출
            const shopMatch = title.match(/^\[([^\]]+)\]/);
            const shopName = shopMatch ? shopMatch[1].trim() : null;

            const thumbMatch = context.match(/<img[^>]*class="[^"]*tmb[^"]*"[^>]*src="([^"]*)"[^>]*>/i);
            let thumbnailUrl = thumbMatch ? thumbMatch[1] : null;
            if (thumbnailUrl?.startsWith("//")) {
                thumbnailUrl = `https:${thumbnailUrl}`;
            }

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
