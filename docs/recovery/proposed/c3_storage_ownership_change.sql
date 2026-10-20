-- Bumper Karma Marketplace — Stage 2: product-image storage permissions (v3, ownership-based)
-- Project: bumper-karma-marketplace (ajpdzffnlwtrvanvttnx)
-- STATUS: PROPOSED — NOT APPLIED. Needs explicit approval before running on live Supabase.
--
-- DESIGN (for the actual product-image workflow)
--   Product images will live in the Supabase bucket "product-images"
--   (it already holds the 1 image a product uses; it is free and already
--   size/type limited). Each user owns a folder named with their user ID:
--       product-images/<user id>/<file name>
--   * Anyone can VIEW product images.
--   * A logged-in user can UPLOAD only into their own folder.
--   * A user can REPLACE/RENAME or DELETE only files they own, and cannot
--     move a file into someone else's folder.
--   * The existing image (stored before folders, as "<user id>-<time>.png")
--     stays viewable, and its recorded owner can replace it in place or
--     delete it (v3.1 adjustment). Nobody else can.
--   Later (Stage 4): uploads limited to APPROVED sellers once seller
--   approval exists in the database.
--
-- WHAT CHANGES (one all-or-nothing transaction)
--   Adds 4 rules (new ones first, so viewing never has a gap), removes the 4 old ones.
-- WHAT DOES NOT CHANGE
--   Files, products, bucket settings, other tables, the live checkout.

begin;

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

-- Replace/rename: only your own files. The result must be EITHER
--   (a) inside your own folder  <your id>/<file>            (all new images), OR
--   (b) a top-level legacy name <your id>-<anything>        (the one older image
--       stored before folders existed), so its owner can replace it in place.
-- (b) never applies to uploads; new uploads must use your folder.
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

drop policy "Authenticated delete 16wiy3a_0" on storage.objects;  -- any logged-in user could delete ANY file
drop policy "Authenticated delete 16wiy3a_1" on storage.objects;  -- viewing rule (despite its name); replaced above
drop policy "Authenticated upload 16wiy3a_0" on storage.objects;  -- any logged-in user could upload ANY file anywhere
drop policy "Public read access 16wiy3a_0"   on storage.objects;  -- viewing rule for all buckets; replaced above

commit;
