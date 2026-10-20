-- Bumper Karma Marketplace — Step 1 ROLLBACK (undo) script
-- Supabase project: bumper-karma-marketplace (ajpdzffnlwtrvanvttnx)
-- Original state captured 2026-10-19, before any Step 1 change.
--
-- !!! WARNING — READ BEFORE RUNNING !!!
-- This restores the ORIGINAL setup EXACTLY, INCLUDING ITS SECURITY HOLES:
--   * buyers' browsers could again set order totals (place_order removed)
--   * negative product prices allowed again; uploads unlimited in size/type
--   * ANY logged-in user could again DELETE ANY stored file and UPLOAD ANY
--     file under ANY name
-- Use only if a Step 1 change causes a problem that cannot be fixed another way.
--
-- Running this puts every Step 1 database change back exactly as it was.
-- It deletes no stored data (no products, orders, accounts or images).
-- Safe to run at any point in Step 1: every line works whether or not
-- that part of Step 1 has been applied yet.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste all -> Run.

begin;

-- ---------- Undo Stage A ----------
drop function if exists public.place_order(jsonb);
alter table public.products drop constraint if exists products_price_nonnegative;
update storage.buckets
   set file_size_limit = null, allowed_mime_types = null
 where id = 'product-images';

-- ---------- Undo image-storage permissions (Stage C3) ----------
drop policy if exists "bk_product_images_public_read" on storage.objects;
drop policy if exists "bk_product_images_upload_own"  on storage.objects;
drop policy if exists "bk_product_images_update_own"  on storage.objects;
drop policy if exists "bk_product_images_delete_own"  on storage.objects;

-- Restore the 4 original storage rules exactly (dropped first so this never errors)
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

-- ---------- Original order permissions (NOT changed in Step 1; on hold) ----------
-- order_items: "Allow insert for authenticated users"      INSERT to public        with check (auth.uid() IS NOT NULL)
-- order_items: "read_order_items"                          SELECT to authenticated using (auth.uid() IS NOT NULL)
-- orders:      "Enable insert for authenticated users only" INSERT to authenticated with check (buyer_id = auth.uid())
-- orders:      "Users can view their own orders"           SELECT to public        using (auth.uid() = buyer_id)
