-- migrate:down
drop table if exists campaign cascade;
drop table if exists campaign_images cascade;

-- migrate:up
create extension if not exists citext;
-- migrate:up
create table if not exists campaign (
    id int primary key generated always as identity,
    name text not null,
    from_date timestamptz not null,
    to_date timestamptz not null,
    total_budget float not null,
    daily_budget float not null,
    creative_upload text not null,
    creative_upload_id text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
