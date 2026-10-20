-- Bumper Karma Marketplace — product-image storage permissions ROLLBACK (for v3)
--
-- !!! WARNING — READ BEFORE RUNNING !!!
-- This restores the ORIGINAL rules EXACTLY, INCLUDING THEIR SECURITY HOLES:
--   * ANY logged-in user could again DELETE ANY stored file, including
--     other sellers' images.
--   * ANY logged-in user could again UPLOAD ANY file, under ANY name, into
--     ANY bucket.
-- Use only if the v3 change causes a problem that cannot be fixed another way.
-- Deletes no files or data. Safe to run whether or not v3 was applied.
-- Original definitions captured read-only from live Supabase (2026-10-19,
-- re-confirmed 2026-10-20 10:11 and 10:19).

begin;

drop policy if exists "bk_product_images_public_read" on storage.objects;
drop policy if exists "bk_product_images_upload_own"  on storage.objects;
drop policy if exists "bk_product_images_update_own"  on storage.objects;
drop policy if exists "bk_product_images_delete_own"  on storage.objects;

drop policy if exists "Authenticated delete 16wiy3a_0" on storage.objects;
create policy "Authenticated delete 16wiy3a_0" on storage.objects as permissive
  for delete to authenticated using (auth.role() = 'authenticated'::text);

drop policy if exists "Authenticated delete 16wiy3a_1" on storage.objects;
create policy "Authenticated delete 16wiy3a_1" on storage.objects as permissive
  for select to authenticated using (auth.role() = 'authenticated'::text);

drop policy if exists "Authenticated upload 16wiy3a_0" on storage.objects;
create policy "Authenticated upload 16wiy3a_0" on storage.objects as permissive
  for insert to authenticated with check (auth.role() = 'authenticated'::text);

drop policy if exists "Public read access 16wiy3a_0" on storage.objects;
create policy "Public read access 16wiy3a_0" on storage.objects as permissive
  for select to public using (true);

commit;
