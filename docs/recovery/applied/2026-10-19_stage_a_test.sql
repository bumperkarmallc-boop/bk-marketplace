-- Bumper Karma Marketplace — Step 1, Stage A security test (v3)
-- Project: bumper-karma-marketplace (ajpdzffnlwtrvanvttnx)
--
-- v3: rollback dry-run REMOVED. This test makes NO structural changes:
--     it never drops or creates rules, functions or constraints, and never
--     changes bucket settings. It does not touch the storage tables at all
--     except to READ their rules and settings.
--
-- SAFETY
-- * One single command. Its final line ALWAYS throws an error, which cancels
--   the whole command: the test product, test orders and test order items
--   are all erased. Nothing can be saved.
-- * The only writes are brand-new test rows in products / orders / order_items
--   (plain table rows; these tables have no triggers).
-- * If a check hits an unexpected error, it is caught, reported as FAIL with
--   the error text, and the test continues.
-- * If the message you see does NOT begin with "TEST RESULTS", the test
--   crashed: treat it as FAILED. It is still fully undone.
-- * Uses two pretend users (ids ending ...0a and ...0b) that do not exist.
--   Real orders, products, accounts and images are never read or changed.
-- * Does not change the live checkout or the two held order permissions;
--   those are only compared, never modified.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste ALL of this -> Run.
-- Do not add BEGIN/COMMIT. The red ERROR starting "TEST RESULTS" is expected.

do $$
declare
  admin_role text := current_user;
  ua uuid := '00000000-0000-4000-a000-00000000000a';   -- pretend User A (buyer)
  ub uuid := '00000000-0000-4000-a000-00000000000b';   -- pretend User B (other user / seller)
  p1 uuid := gen_random_uuid();                          -- test product, price 25
  test_order uuid;
  n int; t int; cname text;
  passes int := 0; fails int := 0; infos int := 0; checks int := 0;
  r text := '';
begin
  ------------------------------------------------------------------
  -- Setup (as admin): one test product owned by B, real price 25
  ------------------------------------------------------------------
  insert into public.products (id, user_id, title, price)
  values (p1, ub, 'TEST tee (auto-undone)', 25);

  ------------------------------------------------------------------
  -- S0  Pretend-user simulation is really active
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    if current_user = 'authenticated' and auth.uid() = ua and auth.role() = 'authenticated' then
      passes := passes + 1; r := r || 'PASS S0 simulation active (role authenticated, uid = A) | ';
    else
      fails := fails + 1; r := r || 'FAIL S0 simulation NOT active (role ' || current_user || ') | ';
    end if;
    perform set_config('role', admin_role, true);
  exception when others then
    fails := fails + 1; r := r || 'FAIL S0 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T1  Logged-out visitor cannot call place_order (execute privilege removed)
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  '', true);
    perform set_config('request.jwt.claim.role', 'anon', true);
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);
    perform set_config('role', 'anon', true);
    begin
      perform public.place_order(json_build_array(json_build_object('product_id',p1,'quantity',1))::jsonb);
      fails := fails + 1; r := r || 'FAIL T1 logged-out visitor placed an order | ';
    exception
      when insufficient_privilege then
        passes := passes + 1; r := r || 'PASS T1 logged-out visitor blocked (no permission) | ';
      when others then
        fails := fails + 1; r := r || 'FAIL T1 blocked for wrong reason: ' || sqlerrm || ' | ';
    end;
    perform set_config('role', admin_role, true);
  exception when others then
    fails := fails + 1; r := r || 'FAIL T1 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T2  A places an order sending a FAKE price of 1; total must use real price 25
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    test_order := public.place_order(json_build_array(json_build_object('product_id',p1,'quantity',2,'price',1))::jsonb);
    perform set_config('role', admin_role, true);
    select total into t from public.orders where id = test_order and buyer_id = ua;
    select count(*) into n from public.order_items where order_id = test_order;
    if t = 50 and n = 1
       and exists (select 1 from public.order_items where order_id = test_order and product_id = p1 and price = 25 and quantity = 2) then
      passes := passes + 1; r := r || 'PASS T2 total 50 from database price (fake price 1 ignored) | ';
    else
      fails := fails + 1; r := r || 'FAIL T2 total ' || coalesce(t::text,'missing') || ', items ' || n || ' | ';
    end if;
  exception when others then
    test_order := null;
    fails := fails + 1; r := r || 'FAIL T2 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T3  Invalid quantities rejected with the exact expected reason
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    n := 0;
    begin perform public.place_order(json_build_array(json_build_object('product_id',p1,'quantity',0))::jsonb);
    exception when others then if sqlerrm = 'Invalid quantity' then n := n + 1; end if; end;
    begin perform public.place_order(json_build_array(json_build_object('product_id',p1,'quantity',-5))::jsonb);
    exception when others then if sqlerrm = 'Invalid quantity' then n := n + 1; end if; end;
    begin perform public.place_order(json_build_array(json_build_object('product_id',p1,'quantity',100))::jsonb);
    exception when others then if sqlerrm = 'Invalid quantity' then n := n + 1; end if; end;
    perform set_config('role', admin_role, true);
    if n = 3 then passes := passes + 1; r := r || 'PASS T3 quantities 0, -5, 100 rejected | ';
    else fails := fails + 1; r := r || 'FAIL T3 only ' || n || ' of 3 bad quantities rejected correctly | ';
    end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL T3 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T4  Non-existent product rejected with the exact expected reason
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      perform public.place_order('[{"product_id":"00000000-0000-0000-0000-000000000000","quantity":1}]');
      fails := fails + 1; r := r || 'FAIL T4 fake product accepted | ';
    exception when others then
      if sqlerrm = 'Product not found' then passes := passes + 1; r := r || 'PASS T4 fake product rejected | ';
      else fails := fails + 1; r := r || 'FAIL T4 rejected for wrong reason: ' || sqlerrm || ' | '; end if;
    end;
    perform set_config('role', admin_role, true);
  exception when others then
    fails := fails + 1; r := r || 'FAIL T4 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T5  Positive control: A CAN see her own order (proves the denials below are real)
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    select count(*) into n from public.orders where id = test_order;
    perform set_config('role', admin_role, true);
    if test_order is not null and n = 1 then passes := passes + 1; r := r || 'PASS T5 A can see her own order | ';
    else fails := fails + 1; r := r || 'FAIL T5 A cannot see her own order (or T2 failed) | '; end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL T5 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T6-T8  User B cannot see, change, or delete A's order
  ------------------------------------------------------------------
  checks := checks + 3;
  begin
    perform set_config('request.jwt.claim.sub',  ub::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);

    select count(*) into n from public.orders where id = test_order;
    if test_order is not null and n = 0 then passes := passes + 1; r := r || 'PASS T6 B cannot see A''s order | ';
    else fails := fails + 1; r := r || 'FAIL T6 B can see A''s order (or no order to test) | '; end if;

    update public.orders set total = 1, status = 'hacked' where id = test_order;
    get diagnostics n = row_count;
    perform set_config('role', admin_role, true);
    select total into t from public.orders where id = test_order;
    if test_order is not null and n = 0 and t = 50 then passes := passes + 1; r := r || 'PASS T7 B cannot change A''s order (total still 50) | ';
    else fails := fails + 1; r := r || 'FAIL T7 B changed A''s order (rows ' || n || ', total ' || coalesce(t::text,'missing') || ') | '; end if;

    perform set_config('role', 'authenticated', true);
    delete from public.orders where id = test_order;
    get diagnostics n = row_count;
    perform set_config('role', admin_role, true);
    if test_order is not null and n = 0 and exists (select 1 from public.orders where id = test_order) then
      passes := passes + 1; r := r || 'PASS T8 B cannot delete A''s order (order still exists) | ';
    else fails := fails + 1; r := r || 'FAIL T8 B deleted A''s order | '; end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL T6-T8 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- T9  Negative price blocked by the new rule (with a positive control)
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub',  ub::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    insert into public.products (user_id, title, price) values (ub, 'TEST ok price (auto-undone)', 10);  -- must succeed
    begin
      insert into public.products (user_id, title, price) values (ub, 'TEST negative (auto-undone)', -1);
      fails := fails + 1; r := r || 'FAIL T9 negative price accepted | ';
    exception when check_violation then
      get stacked diagnostics cname = constraint_name;
      if cname = 'products_price_nonnegative' then passes := passes + 1; r := r || 'PASS T9 negative price blocked (valid price allowed) | ';
      else fails := fails + 1; r := r || 'FAIL T9 blocked by unexpected rule ' || coalesce(cname,'?') || ' | '; end if;
    end;
    perform set_config('role', admin_role, true);
  exception when others then
    fails := fails + 1; r := r || 'FAIL T9 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- INFO  Known open items (held until the new checkout is live) — not pass/fail
  ------------------------------------------------------------------
  begin
    perform set_config('request.jwt.claim.sub',  ub::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    select count(*) into n from public.order_items where order_id = test_order;
    infos := infos + 1;
    r := r || case when n > 0 then 'INFO H1 still open (held): B can read A''s order items | '
                   else 'INFO H1 B cannot read A''s order items (unexpected — tell Claude) | ' end;
    begin
      insert into public.orders (buyer_id, total) values (ub, 1);
      infos := infos + 1; r := r || 'INFO H2 still open (held): a user can create their own order with a made-up total | ';
    exception when others then
      infos := infos + 1; r := r || 'INFO H2 direct order creation blocked (unexpected — tell Claude) | ';
    end;
    perform set_config('role', admin_role, true);
  exception when others then
    infos := infos + 1; r := r || 'INFO held-item check error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- R0  Saved original storage rules (copied from a read-only snapshot taken
  --     before Stage A) match what is live right now (read-only)
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('role', admin_role, true);
    select count(*) into n
    from (values
      ('Authenticated delete 16wiy3a_0','PERMISSIVE','DELETE','{authenticated}','(auth.role() = ''authenticated''::text)',null),
      ('Authenticated delete 16wiy3a_1','PERMISSIVE','SELECT','{authenticated}','(auth.role() = ''authenticated''::text)',null),
      ('Authenticated upload 16wiy3a_0','PERMISSIVE','INSERT','{authenticated}',null,'(auth.role() = ''authenticated''::text)'),
      ('Public read access 16wiy3a_0','PERMISSIVE','SELECT','{public}','true',null)
    ) as saved(pname, perm, cmd, roles, qual, wchk)
    join pg_policies p on p.schemaname = 'storage' and p.tablename = 'objects' and p.policyname = saved.pname
     and p.permissive = saved.perm and p.cmd = saved.cmd and p.roles::text = saved.roles
     and p.qual is not distinct from saved.qual and p.with_check is not distinct from saved.wchk;
    if n = 4 then passes := passes + 1; r := r || 'PASS R0 saved original storage rules match live rules exactly | ';
    else fails := fails + 1; r := r || 'FAIL R0 only ' || n || ' of 4 saved storage rules match live | '; end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL R0 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- R1  Rollback script targets match exactly what Stage A applied (read-only)
  --     Confirms each "undo" line in step1_rollback.sql points at a real,
  --     correctly named object, so it would not silently miss anything.
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('role', admin_role, true);
    n := 0;
    if to_regprocedure('public.place_order(jsonb)') is not null then n := n + 1; end if;
    if exists (select 1 from pg_constraint where conname = 'products_price_nonnegative'
               and conrelid = 'public.products'::regclass
               and pg_get_constraintdef(oid) = 'CHECK ((price >= 0))') then n := n + 1; end if;
    if exists (select 1 from storage.buckets where id = 'product-images' and public = true
               and file_size_limit = 5242880
               and allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif']) then n := n + 1; end if;
    if not exists (select 1 from pg_policies where schemaname = 'storage' and policyname like 'bk\_product\_images\_%') then n := n + 1; end if;
    if n = 4 then passes := passes + 1; r := r || 'PASS R1 rollback targets match what Stage A applied (function, price rule, bucket limits; no new storage rules yet) | ';
    else fails := fails + 1; r := r || 'FAIL R1 only ' || n || ' of 4 rollback targets match | '; end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL R1 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- R2  Live order permissions still match the saved originals (read-only)
  --     Confirms the live checkout's permissions are untouched.
  ------------------------------------------------------------------
  checks := checks + 1;
  begin
    perform set_config('role', admin_role, true);
    select count(*) into n
    from (values
      ('order_items','Allow insert for authenticated users','INSERT','{public}',null,'(auth.uid() IS NOT NULL)'),
      ('order_items','read_order_items','SELECT','{authenticated}','(auth.uid() IS NOT NULL)',null),
      ('orders','Enable insert for authenticated users only','INSERT','{authenticated}',null,'(buyer_id = auth.uid())'),
      ('orders','Users can view their own orders','SELECT','{public}','(auth.uid() = buyer_id)',null)
    ) as saved(tname, pname, cmd, roles, qual, wchk)
    join pg_policies p on p.schemaname = 'public' and p.tablename = saved.tname and p.policyname = saved.pname
     and p.cmd = saved.cmd and p.roles::text = saved.roles
     and p.qual is not distinct from saved.qual and p.with_check is not distinct from saved.wchk;
    if n = 4 and (select count(*) from pg_policies where schemaname = 'public' and tablename in ('orders','order_items')) = 4 then
      passes := passes + 1; r := r || 'PASS R2 live order permissions match saved originals (checkout untouched) | ';
    else fails := fails + 1; r := r || 'FAIL R2 live order permissions differ from saved originals | '; end if;
  exception when others then
    fails := fails + 1; r := r || 'FAIL R2 error: ' || sqlerrm || ' | ';
  end;

  ------------------------------------------------------------------
  -- Report and UNDO EVERYTHING (this exception cancels the whole command)
  ------------------------------------------------------------------
  raise exception 'TEST RESULTS — % FAILED, % passed, % info, % of 13 checks run. Everything was undone. || %',
    fails, passes, infos, checks, r;
end $$;
