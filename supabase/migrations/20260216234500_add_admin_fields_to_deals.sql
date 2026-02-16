alter table tinyhoney.deals
    add column if not exists is_hidden boolean not null default false,
    add column if not exists admin_note text,
    add column if not exists moderated_by uuid references auth.users(id),
    add column if not exists moderated_at timestamptz;

create index if not exists idx_deals_is_hidden on tinyhoney.deals(is_hidden);
