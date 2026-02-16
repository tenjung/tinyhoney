-- TinyHoney crawler tables for schema-aware Supabase client
-- API route uses: createClient(..., { db: { schema: "tinyhoney" } })

create schema if not exists tinyhoney;

create table if not exists tinyhoney.deals (
    id bigserial primary key,
    title text not null,
    url text not null unique,
    source text not null,
    price integer not null default 0,
    original_price integer,
    shipping_fee integer not null default 0,
    discount_rate integer,
    category text,
    thumbnail_url text,
    shop_name text,
    description text,
    posted_at timestamptz,
    is_lowest boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists tinyhoney.price_histories (
    id bigserial primary key,
    deal_id bigint not null references tinyhoney.deals(id) on delete cascade,
    recorded_price integer not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_deals_source on tinyhoney.deals(source);
create index if not exists idx_deals_posted_at on tinyhoney.deals(posted_at desc);
create index if not exists idx_price_histories_deal_id on tinyhoney.price_histories(deal_id);

alter table tinyhoney.deals enable row level security;
alter table tinyhoney.price_histories enable row level security;

do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'tinyhoney'
          and tablename = 'deals'
          and policyname = 'Allow public read deals'
    ) then
        create policy "Allow public read deals"
            on tinyhoney.deals
            for select
            to anon, authenticated
            using (true);
    end if;
end $$;

do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'tinyhoney'
          and tablename = 'price_histories'
          and policyname = 'Allow public read price_histories'
    ) then
        create policy "Allow public read price_histories"
            on tinyhoney.price_histories
            for select
            to anon, authenticated
            using (true);
    end if;
end $$;
