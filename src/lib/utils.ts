/**
 * Format price as Korean currency string.
 * e.g. 15000 → "15,000원"
 */
export function formatPrice(price: number): string {
    return `${price.toLocaleString("ko-KR")}원`;
}

/**
 * Time ago in Korean.
 * e.g. "3분전", "2시간전", "1일전"
 */
export function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months}달전`;
    if (weeks > 0) return `${weeks}주전`;
    if (days > 0) return `${days}일전`;
    if (hours > 0) return `${hours}시간전`;
    if (minutes > 0) return `${minutes}분전`;
    return "방금전";
}

/**
 * Calculate days left until end date.
 */
export function daysLeft(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Parse prize_tags string into array.
 */
export function parsePrizeTags(tags: string | null): string[] {
    if (!tags) return [];
    try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [tags];
    } catch {
        return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
}

/**
 * Get source display name in Korean.
 */
export function sourceLabel(source: string): string {
    const map: Record<string, string> = {
        PPOMPPU: "뽐뿌",
        RULIWEB: "루리웹",
        QUASARZONE: "퀘이사존",
        AMISAE: "어미새",
        CLIEN: "클리앙",
        ARCALIVE: "아카라이브",
        FMKOREA: "FM코리아",
    };
    return map[source] || source;
}
