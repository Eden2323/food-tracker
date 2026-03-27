-- ============================================================
-- Food Tracker — full schema migration
-- Paste this entire file into the Supabase SQL editor and run.
-- RLS is intentionally disabled (single-user app, anon key).
-- ============================================================


-- ------------------------------------------------------------
-- 1. pantry_items
-- ------------------------------------------------------------
create table pantry_items (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  brand       text,
  category    text,
  quantity    numeric     not null default 1,
  unit        text        not null default 'count',
  expiry_date date,
  barcode     text,
  image_url   text,
  location    text        not null default 'pantry',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);


-- ------------------------------------------------------------
-- 2. recipes
-- ------------------------------------------------------------
create table recipes (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  description  text,
  instructions text,
  created_at   timestamptz default now()
);


-- ------------------------------------------------------------
-- 3. recipe_ingredients
-- ------------------------------------------------------------
create table recipe_ingredients (
  id         uuid    primary key default gen_random_uuid(),
  recipe_id  uuid    references recipes(id) on delete cascade not null,
  name       text    not null,
  quantity   numeric,
  unit       text
);


-- ------------------------------------------------------------
-- 4. shopping_list
-- ------------------------------------------------------------
create table shopping_list (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  quantity   numeric,
  unit       text,
  category   text,
  checked    boolean     not null default false,
  created_at timestamptz default now()
);


-- ------------------------------------------------------------
-- 5. updated_at trigger for pantry_items
-- ------------------------------------------------------------
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger pantry_items_updated_at
  before update on pantry_items
  for each row execute function update_updated_at();
