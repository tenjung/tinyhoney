/* ── Database Types ── */

export interface Deal {
    id: number;
    title: string;
    url: string;
    source: string;
    category: string | null;
    price: number;
    is_lowest: boolean;
    posted_at: string | null;
    thumbnail_url: string | null;
    description: string | null;
    shop_name: string | null;
    shipping_fee: number;
    created_at: string;
    updated_at: string;
    price_histories?: PriceHistory[];
}

export interface PriceHistory {
    id: number;
    deal_id: number;
    recorded_price: number;
    created_at: string;
}

export interface Event {
    id: number;
    title: string;
    url: string | null;
    platform_type: string | null;
    is_manual: boolean;
    description: string | null;
    thumbnail_url: string | null;
    organizer: string | null;
    start_date: string | null;
    end_date: string | null;
    entry_type: string | null;
    announcement_date: string | null;
    winner_count: number;
    prize_tags: string | null;
    share_count: number;
    bookmark_count: number;
    created_at: string;
    updated_at: string;
}

export interface Board {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    posts_count?: number;
}

export interface Post {
    id: number;
    title: string;
    content: string | null;
    user_id: string;
    board_id: number;
    created_at: string;
    updated_at: string;
    board?: Board;
    profile?: Profile;
    comments_count?: number;
}

export interface Comment {
    id: number;
    content: string;
    user_id: string;
    post_id: number;
    created_at: string;
    profile?: Profile;
}

export interface Profile {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    keywords: string[];
    alert_enabled: boolean;
    is_admin: boolean;
    created_at: string;
}

/* ── Utility Types ── */

export interface Stat {
    label: string;
    value: number | string;
    color?: string;
}

export interface FilterOption {
    label: string;
    value: string | null;
}

export type DealSource =
    | "PPOMPPU"
    | "RULIWEB"
    | "QUASARZONE"
    | "AMISAE"
    | "CLIEN"
    | "ARCALIVE"
    | "FMKOREA";
