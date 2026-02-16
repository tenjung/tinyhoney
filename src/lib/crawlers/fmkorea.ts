import type { CrawlerConfig, ParsedDeal } from "./types";
import { stripTags, extractNumber, decodeEntities } from "./base";

/**
 * FM코리아 핫딜 크롤러
 *
 * 구조: XpressEngine 기반. 각 딜이 <div class="li"> 또는 <li> 안에
 * 제목/쇼핑몰/가격/배송비/카테고리가 별도 필드로 분리되어 있음.
 * 가장 구조화된 데이터를 제공하는 소스.
 */
const fmkoreaCrawler: CrawlerConfig = {
    name: "FM코리아",
    source: "FMKOREA",
    url: "https://www.fmkorea.com/hotdeal",
    headers: {
        Referer: "https://www.fmkorea.com/",
    },
    parseList(html: string): ParsedDeal[] {
        const deals: ParsedDeal[] = [];

        // FM코리아 핫딜은 li.li 또는 div 기반 리스트
        // 각 아이템에 제목 링크 + h3.title + 쇼핑몰/가격/배송비/카테고리 spans
        const itemRegex = /<li[^>]*class="[^"]*li[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
        let itemMatch;

        while ((itemMatch = itemRegex.exec(html)) !== null) {
            const item = itemMatch[1];

            // 제목 + URL 추출
            const titleLinkMatch = item.match(
                /<a[^>]*href="(\/\d+|https:\/\/www\.fmkorea\.com\/\d+)"[^>]*>([\s\S]*?)<\/a>/i
            );
            if (!titleLinkMatch) continue;

            const href = titleLinkMatch[1];
            const title = decodeEntities(stripTags(titleLinkMatch[2])).replace(/\s+/g, " ").trim();
            if (!title || title.length < 3) continue;

            const url = href.startsWith("http")
                ? href
                : `https://www.fmkorea.com${href}`;

            // 쇼핑몰명 추출 (category_area 안의 span 또는 별도 요소)
            const shopMatch = item.match(
                /class="[^"]*hotdeal_info[^"]*"[\s\S]*?<span[^>]*>([^<]+)<\/span>/i
            ) || item.match(
                /shopping_mall[^>]*>([^<]+)</i
            );
            const shopName = shopMatch ? stripTags(shopMatch[1]).trim() : null;

            // 가격 추출
            const priceMatch = item.match(
                /price[^>]*>([\d,]+)\s*원/i
            ) || item.match(
                /([\d,]+)\s*원/
            );
            const price = priceMatch ? extractNumber(priceMatch[1]) : 0;

            // 배송비 추출
            const shippingMatch = item.match(/배송비[^>]*>([^<]*)</i)
                || item.match(/(무료|[\d,]+\s*원)/);
            let shippingFee = 0;
            if (shippingMatch && shippingMatch[1] !== "무료") {
                shippingFee = extractNumber(shippingMatch[1]);
            }

            // 카테고리 추출
            const categoryMatch = item.match(
                /category[^>]*>([^<]+)<\/a>/i
            ) || item.match(
                /cate[^>]*>([^<]+)</i
            );
            const category = categoryMatch ? stripTags(categoryMatch[1]).trim() : null;

            // 썸네일 추출
            const thumbMatch = item.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
            const thumbnailUrl = thumbMatch ? thumbMatch[1] : null;

            deals.push({
                title,
                url,
                price,
                shipping_fee: shippingFee,
                category,
                thumbnail_url: thumbnailUrl,
                shop_name: shopName,
            });
        }

        return deals;
    },
};

export default fmkoreaCrawler;
