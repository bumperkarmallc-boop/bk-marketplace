// Creates FAKE test accounts and products in the temporary local test Supabase.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  BUCKET, BUYER_B, SELLER_A, TEST_PNG, adminClient, assertLocalTestStack, signedInClient,
  type SeedState,
} from "./helpers";

export default async function globalSetup() {
  assertLocalTestStack();
  const admin = adminClient();

  for (const u of [SELLER_A, BUYER_B]) {
    const { error } = await admin.auth.admin.createUser({
      email: u.email, password: u.password, email_confirm: true,
    });
    if (error && !/already/i.test(error.message)) throw new Error("Create test user failed: " + error.message);
  }

  const a = await signedInClient(SELLER_A);
  const b = await signedInClient(BUYER_B);

  // Seller A uploads an image into A's own folder, the same way the site does
  const path = `${a.userId}/seed-${randomUUID()}.png`;
  const up = await a.client.storage.from(BUCKET).upload(path, TEST_PNG, { contentType: "image/png" });
  if (up.error) throw new Error("Seed image upload failed: " + up.error.message);
  const image = a.client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const withImage = await a.client.from("products")
    .insert({ title: "Seed Tee With Image", description: "Test product (fake)", price: 25, image, user_id: a.userId })
    .select("id").single();
  if (withImage.error) throw new Error("Seed product failed: " + withImage.error.message);

  const noImage = await a.client.from("products")
    .insert({ title: "Seed Sticker No Image", description: "Test product (fake)", price: 12, user_id: a.userId })
    .select("id").single();
  if (noImage.error) throw new Error("Seed product failed: " + noImage.error.message);

  const state: SeedState = {
    sellerAId: a.userId,
    buyerBId: b.userId,
    productWithImage: { id: withImage.data.id, title: "Seed Tee With Image", price: 25, image, path },
    productNoImage: { id: noImage.data.id, title: "Seed Sticker No Image", price: 12 },
  };
  writeFileSync(join(__dirname, ".state.json"), JSON.stringify(state, null, 2));
}
