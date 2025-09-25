-- Supabase schema for Luno MVP
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid text unique,
  email text,
  created_at timestamptz default now()
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  category text,
  base_rate_pct numeric default 1,
  affiliate_url text,
  logo_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  brand_name text,
  category text,
  monthly_spend numeric,
  years_with_brand integer default 0,
  base_rate_pct numeric default 1,
  created_at timestamptz default now()
);
