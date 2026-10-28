-- Bumper Karma Marketplace — database STRUCTURE for the temporary TEST copy only.
--
-- Used ONLY by the automated test workflow (.github/workflows/e2e-test.yml),
-- which starts a brand-new, empty, private Supabase on GitHub's build server.
-- It is NEVER run against the live project. It contains NO data, accounts,
-- keys or secrets.
--
-- Written from read-only inspections of the live project:
--   * table columns and the place_order function: 2026-10-28
--   * product / order security rules and table permissions: 2026-10-19 (re-confirmed 2026-10-20)
--   * price rule: 2026-10-20
--   * storage rules (v3.1) and bucket limits: 2026-10-28
-- The test workflow compares the result with tests/e2e/expected-schema.txt.

-- ---------------------------------------------------------------- tables
create table public.products (
  user_id     uuid,
  title       text not null,
  description text,
  price       integer not null,
  image       text,
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now()
);

create table public.orders (
  quantity         integer default 1,
  buyer_email      text,
  shipping_address text,
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  buyer_id         uuid,
  product_id       uuid,
  seller_id        uuid,
  price            integer,
  status           text default 'pending',
  product_title    text,
  total            integer
);

create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid,
  quantity   integer,
  price      integer,
  product_id uuid
);

alter table public.products
  add constraint products_price_nonnegative check (price >= 0);

alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Live: anon and authenticated have all table privileges; the rules below decide access.
grant all on public.products, public.orders, public.order_items to anon, authenticated;

-- ---------------------------------------------------------------- product rules (live, unchanged)
create policy "Authenticated users can delete their own products" on public.products
  for delete to authenticated using (auth.uid() = user_id);
create policy "Authenticated users can insert their own products" on public.products
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Authenticated users can read their own products" on public.products
  for select to authenticated using (auth.uid() = user_id);
create policy "Authenticated users can update their own products" on public.products
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public can read products" on public.products
  for select to anon using (true);
create policy "read_products" on public.products
  for select to public using (true);

-- ---------------------------------------------------------------- order rules (live, unchanged — 2 known holes held)
create policy "Allow insert for authenticated users" on public.order_items
  for insert to public with check (auth.uid() is not null);
create policy "read_order_items" on public.order_items
  for select to authenticated using (auth.uid() is not null);
create policy "Enable insert for authenticated users only" on public.orders
  for insert to authenticated with check (buyer_id = auth.uid());
create policy "Users can view their own orders" on public.orders
  for select to public using (auth.uid() = buyer_id);

-- ---------------------------------------------------------------- place_order (live definition, 2026-10-28)
create or replace function public.place_order(items jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_order uuid;
  v_total integer := 0;
  it jsonb;
  v_pid uuid;
  v_qty integer;
  v_price integer;
begin
  if v_uid is null then
    raise exception 'Please log in first' using errcode = '28000';
  end if;
  if items is null or jsonb_typeof(items) <> 'array'
     or jsonb_array_length(items) < 1 or jsonb_array_length(items) > 50 then
    raise exception 'Cart is empty or too large';
  end if;

  for it in select value from jsonb_array_elements(items) loop
    begin
      v_pid := (it->>'product_id')::uuid;
      v_qty := (it->>'quantity')::integer;
    exception when others then
      raise exception 'Invalid cart item';
    end;
    if v_pid is null then raise exception 'Invalid cart item'; end if;
    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'Invalid quantity';
    end if;
    select p.price into v_price from public.products p where p.id = v_pid;
    if not found or v_price is null then
      raise exception 'Product not found';
    end if;
    v_total := v_total + v_price * v_qty;
  end loop;

  insert into public.orders (buyer_id, total, status)
  values (v_uid, v_total, 'pending')
  returning id into v_order;

  insert into public.order_items (order_id, product_id, quantity, price)
  select v_order, (e->>'product_id')::uuid, (e->>'quantity')::integer, p.price
  from jsonb_array_elements(items) e
  join public.products p on p.id = (e->>'product_id')::uuid;

  return v_order;
end;
$$;

revoke all on function public.place_order(jsonb) from public;
revoke all on function public.place_order(jsonb) from anon;
grant execute on function public.place_order(jsonb) to authenticated;

-- ---------------------------------------------------------------- image bucket (live settings)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
        array['image/png','image/jpeg','image/webp','image/gif']);

-- ---------------------------------------------------------------- storage rules v3.1 (live, applied 2026-10-20)
create policy "bk_product_images_public_read" on storage.objects
  as permissive for select to public
  using (bucket_id = 'product-images');

create policy "bk_product_images_upload_own" on storage.objects
  as permissive for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and owner_id = (select auth.uid())::text
    and split_part(name, '/', 1) = (select auth.uid())::text
  );

create policy "bk_product_images_update_own" on storage.objects
  as permissive for update to authenticated
  using (
    bucket_id = 'product-images'
    and owner_id = (select auth.uid())::text
  )
  with check (
    bucket_id = 'product-images'
    and owner_id = (select auth.uid())::text
    and (
      split_part(name, '/', 1) = (select auth.uid())::text
      or (
        position('/' in name) = 0
        and starts_with(name, (select auth.uid())::text || '-')
      )
    )
  );

create policy "bk_product_images_delete_own" on storage.objects
  as permissive for delete to authenticated
  using (
    bucket_id = 'product-images'
    and owner_id = (select auth.uid())::text
  );
