-- Bumper Karma Marketplace — product-image storage permission test (for v3 ownership rules)
-- STATUS: PROPOSED — run only AFTER c3_storage_ownership_change.sql is approved and applied.
--
-- SAFETY
-- * One single command; its final line ALWAYS throws an error, which cancels the
--   whole command. Every temporary row is erased.
-- * Writes only temporary file RECORDS (names only, no real files) for two pretend
--   users, plus their attempts to change/delete each other's records.
-- * No structural changes: never creates/drops rules, functions, constraints or
--   tables; never changes bucket settings.
-- * Your real image is never read, changed or deleted. E1 only counts records.
-- * Does not touch orders, order items, products or checkout.
-- * Any unexpected error in a check is reported as FAIL with its text. If the
--   message does NOT begin with "TEST RESULTS", the test crashed: treat as FAILED.
-- * INCONCLUSIVE = Supabase's own guard stopped a direct database delete before
--   the rule could be judged; confirm through the real website.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste ALL -> Run.

do $$
declare
  admin_role text := current_user;
  ua uuid := '00000000-0000-4000-a000-00000000000a';
  ub uuid := '00000000-0000-4000-a000-00000000000b';
  fa text := '00000000-0000-4000-a000-00000000000a/bk-test-' || md5(random()::text) || '.png';
  fb text := '00000000-0000-4000-a000-00000000000b/bk-test-' || md5(random()::text) || '.png';
  nm text; real_before int; n int;
  passes int := 0; fails int := 0; inconcl int := 0; checks int := 0;
  r text := '';
begin
  select count(*) into real_before from storage.objects where bucket_id='product-images' and name not like '%bk-test-%';

  -- S0 simulation active
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ua::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    if current_user='authenticated' and auth.uid()=ua then passes:=passes+1; r:=r||'PASS S0 simulation active | ';
    else fails:=fails+1; r:=r||'FAIL S0 simulation NOT active | '; end if;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL S0 error: '||sqlerrm||' | '; end;

  -- U1 A uploads into her own folder (positive control)
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ua::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    insert into storage.objects (bucket_id, name, owner_id) values ('product-images', fa, ua::text);
    perform set_config('role', admin_role, true);
    passes:=passes+1; r:=r||'PASS U1 A can upload into her own folder | ';
  exception when others then fa:=null; fails:=fails+1; r:=r||'FAIL U1 A could not upload into her own folder: '||sqlerrm||' | '; end;

  -- V1 logged-out visitor can view
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', '', true);
    perform set_config('request.jwt.claim.role', 'anon', true);
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);
    perform set_config('role', 'anon', true);
    select count(*) into n from storage.objects where bucket_id='product-images' and name=fa;
    perform set_config('role', admin_role, true);
    if fa is not null and n=1 then passes:=passes+1; r:=r||'PASS V1 logged-out visitor can view product images | ';
    else fails:=fails+1; r:=r||'FAIL V1 logged-out visitor cannot view product images | '; end if;
  exception when others then fails:=fails+1; r:=r||'FAIL V1 error: '||sqlerrm||' | '; end;

  -- V2 bucket still public
  checks := checks + 1;
  if exists (select 1 from storage.buckets where id='product-images' and public=true) then passes:=passes+1; r:=r||'PASS V2 bucket still public | ';
  else fails:=fails+1; r:=r||'FAIL V2 bucket not public | '; end if;

  -- U2 B cannot upload into A's folder
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      insert into storage.objects (bucket_id, name, owner_id) values ('product-images', ua::text||'/bk-test-imposter.png', ub::text);
      fails:=fails+1; r:=r||'FAIL U2 B uploaded into A''s folder | ';
    exception when insufficient_privilege then passes:=passes+1; r:=r||'PASS U2 B cannot upload into A''s folder | ';
      when others then fails:=fails+1; r:=r||'FAIL U2 wrong reason: '||sqlerrm||' | '; end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL U2 error: '||sqlerrm||' | '; end;

  -- U3 B cannot upload a file recorded as A's
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      insert into storage.objects (bucket_id, name, owner_id) values ('product-images', ub::text||'/bk-test-spoof.png', ua::text);
      fails:=fails+1; r:=r||'FAIL U3 B uploaded a file recorded as A''s | ';
    exception when insufficient_privilege then passes:=passes+1; r:=r||'PASS U3 B cannot upload a file recorded as A''s | ';
      when others then fails:=fails+1; r:=r||'FAIL U3 wrong reason: '||sqlerrm||' | '; end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL U3 error: '||sqlerrm||' | '; end;

  -- U4 upload outside any folder is refused
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      insert into storage.objects (bucket_id, name, owner_id) values ('product-images', 'bk-test-no-folder.png', ub::text);
      fails:=fails+1; r:=r||'FAIL U4 upload outside own folder allowed | ';
    exception when insufficient_privilege then passes:=passes+1; r:=r||'PASS U4 upload outside own folder refused | ';
      when others then fails:=fails+1; r:=r||'FAIL U4 wrong reason: '||sqlerrm||' | '; end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL U4 error: '||sqlerrm||' | '; end;

  -- U5 logged-out visitor cannot upload
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', '', true);
    perform set_config('request.jwt.claim.role', 'anon', true);
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);
    perform set_config('role', 'anon', true);
    begin
      insert into storage.objects (bucket_id, name) values ('product-images', 'anon/bk-test.png');
      fails:=fails+1; r:=r||'FAIL U5 logged-out visitor uploaded | ';
    exception when insufficient_privilege then passes:=passes+1; r:=r||'PASS U5 logged-out visitor cannot upload | ';
      when others then fails:=fails+1; r:=r||'FAIL U5 wrong reason: '||sqlerrm||' | '; end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL U5 error: '||sqlerrm||' | '; end;

  -- U6 B can upload into his own folder (positive control)
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claim.role', 'authenticated', true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    insert into storage.objects (bucket_id, name, owner_id) values ('product-images', fb, ub::text);
    perform set_config('role', admin_role, true);
    passes:=passes+1; r:=r||'PASS U6 B can upload into his own folder | ';
  exception when others then fails:=fails+1; r:=r||'FAIL U6 B could not upload into his own folder: '||sqlerrm||' | '; end;

  -- X1 B cannot change/take over A's file
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    update storage.objects set name=ub::text||'/bk-test-stolen.png', owner_id=ub::text where bucket_id='product-images' and name=fa;
    get diagnostics n = row_count;
    perform set_config('role', admin_role, true);
    if fa is not null and n=0 and exists (select 1 from storage.objects where name=fa and owner_id=ua::text) then
      passes:=passes+1; r:=r||'PASS X1 B cannot change A''s image | ';
    else fails:=fails+1; r:=r||'FAIL X1 B changed A''s image | '; end if;
  exception when others then fails:=fails+1; r:=r||'FAIL X1 error: '||sqlerrm||' | '; end;

  -- X2 A can rename her own file within her folder (positive control)
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ua::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    nm := ua::text || '/bk-test-renamed-' || md5(random()::text) || '.png';
    update storage.objects set name=nm where bucket_id='product-images' and name=fa;
    get diagnostics n = row_count;
    perform set_config('role', admin_role, true);
    if n=1 then fa:=nm; passes:=passes+1; r:=r||'PASS X2 A can change her own image | ';
    else fails:=fails+1; r:=r||'FAIL X2 A could not change her own image | '; end if;
  exception when others then fails:=fails+1; r:=r||'FAIL X2 error: '||sqlerrm||' | '; end;

  -- X3 A cannot move her file into B's folder
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ua::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      update storage.objects set name=ub::text||'/bk-test-squat.png' where bucket_id='product-images' and name=fa;
      get diagnostics n = row_count;
      fails:=fails+1; r:=r||case when n=0 then 'FAIL X3 could not run (record missing) | ' else 'FAIL X3 A moved her file into B''s folder | ' end;
    exception when insufficient_privilege then passes:=passes+1; r:=r||'PASS X3 A cannot move a file into B''s folder | ';
      when others then fails:=fails+1; r:=r||'FAIL X3 wrong reason: '||sqlerrm||' | '; end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL X3 error: '||sqlerrm||' | '; end;

  -- D1 B cannot delete A's file
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ub::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ub,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      delete from storage.objects where bucket_id='product-images' and name=fa;
      get diagnostics n = row_count;
      perform set_config('role', admin_role, true);
      if fa is not null and n=0 and exists (select 1 from storage.objects where name=fa) then passes:=passes+1; r:=r||'PASS D1 B cannot delete A''s image | ';
      else fails:=fails+1; r:=r||'FAIL D1 B deleted A''s image | '; end if;
    exception when others then
      if sqlerrm ilike '%direct deletion%' then inconcl:=inconcl+1; r:=r||'INCONCLUSIVE D1 Supabase guard blocked direct delete | ';
      else fails:=fails+1; r:=r||'FAIL D1 error: '||sqlerrm||' | '; end if;
    end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL D1 error: '||sqlerrm||' | '; end;

  -- D2 A can delete her own file (positive control)
  checks := checks + 1;
  begin
    perform set_config('request.jwt.claim.sub', ua::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub',ua,'role','authenticated')::text, true);
    perform set_config('role', 'authenticated', true);
    begin
      delete from storage.objects where bucket_id='product-images' and name=fa;
      get diagnostics n = row_count;
      if n=1 then passes:=passes+1; r:=r||'PASS D2 A can delete her own image | ';
      else fails:=fails+1; r:=r||'FAIL D2 A could not delete her own image | '; end if;
    exception when others then
      if sqlerrm ilike '%direct deletion%' then inconcl:=inconcl+1; r:=r||'INCONCLUSIVE D2 Supabase guard blocked direct delete | ';
      else fails:=fails+1; r:=r||'FAIL D2 error: '||sqlerrm||' | '; end if;
    end;
    perform set_config('role', admin_role, true);
  exception when others then fails:=fails+1; r:=r||'FAIL D2 error: '||sqlerrm||' | '; end;

  -- E1 real image records untouched; existing image still owner-manageable
  checks := checks + 1;
  begin
    perform set_config('role', admin_role, true);
    select count(*) into n from storage.objects where bucket_id='product-images' and name not like '%bk-test-%';
    if n = real_before and not exists (select 1 from storage.objects where bucket_id='product-images' and name not like '%bk-test-%' and owner_id is null) then
      passes:=passes+1; r:=r||'PASS E1 real images untouched and all have a recorded owner | ';
    else fails:=fails+1; r:=r||'FAIL E1 real image count changed or an image has no owner | '; end if;
  exception when others then fails:=fails+1; r:=r||'FAIL E1 error: '||sqlerrm||' | '; end;

  -- R1 new rules present / R2 old rules gone / R3 nothing else changed
  checks := checks + 1;
  select count(*) into n from pg_policies where schemaname='storage' and tablename='objects'
    and policyname in ('bk_product_images_public_read','bk_product_images_upload_own','bk_product_images_update_own','bk_product_images_delete_own');
  if n=4 then passes:=passes+1; r:=r||'PASS R1 all 4 new rules present | '; else fails:=fails+1; r:=r||'FAIL R1 only '||n||' of 4 new rules | '; end if;

  checks := checks + 1;
  select count(*) into n from pg_policies where schemaname='storage' and tablename='objects'
    and policyname in ('Authenticated delete 16wiy3a_0','Authenticated delete 16wiy3a_1','Authenticated upload 16wiy3a_0','Public read access 16wiy3a_0');
  if n=0 then passes:=passes+1; r:=r||'PASS R2 all 4 old rules removed | '; else fails:=fails+1; r:=r||'FAIL R2 '||n||' old rule(s) remain | '; end if;

  checks := checks + 1;
  if (select count(*) from pg_policies where schemaname='storage' and tablename='objects') = 4
     and (select count(*) from pg_policies where schemaname='public' and tablename in ('orders','order_items')) = 4
     and exists (select 1 from storage.buckets where id='product-images' and file_size_limit=5242880) then
    passes:=passes+1; r:=r||'PASS R3 no extra storage rules; order rules and bucket limits unchanged | ';
  else fails:=fails+1; r:=r||'FAIL R3 unexpected storage rules, or order rules / bucket limits changed | '; end if;

  raise exception 'TEST RESULTS — % FAILED, % passed, % inconclusive, % of 18 checks run. Everything was undone. || %',
    fails, passes, inconcl, checks, r;
end $$;
