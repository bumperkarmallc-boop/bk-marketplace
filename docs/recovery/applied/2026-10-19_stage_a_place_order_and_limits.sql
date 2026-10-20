-- APPLIED to live Supabase on 2026-10-19 (Step 1, Stage A). Verified by step1_stage_a_test.sql: 13/13 passed.
-- Undo: docs/recovery/rollback/step1_rollback.sql (restores original vulnerabilities).

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

alter table public.products
  add constraint products_price_nonnegative check (price >= 0);

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif']
where id = 'product-images';
