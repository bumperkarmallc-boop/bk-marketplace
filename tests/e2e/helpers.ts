// Shared helpers for the automated tests.
// Everything here talks ONLY to the temporary local test Supabase started by
// the test workflow (http://127.0.0.1:54321). There are no real accounts,
// data or secrets: the keys come from the temporary stack at run time.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE_KEY = process.env.TEST_SUPABASE_SERVICE_KEY ?? "";

// Safety guard: refuse to run against anything except the local test stack.
export function assertLocalTestStack() {
  const host = new URL(SUPABASE_URL).hostname;
  if (host !== "127.0.0.1" && host !== "localhost") {
    throw new Error("Tests may only run against the local test Supabase (127.0.0.1).");
  }
  if (!ANON_KEY || !SERVICE_KEY) throw new Error("Local test keys are missing.");
}

export const BUCKET = "product-images";

// Fake test accounts (exist only inside the temporary test database)
export const SELLER_A = { email: "seller-a@example.test", password: "test-only-Passw0rd-A" };
export const BUYER_B = { email: "buyer-b@example.test", password: "test-only-Passw0rd-B" };

export function adminClient(): SupabaseClient {
  assertLocalTestStack();
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
}

export async function signedInClient(user: { email: string; password: string }) {
  assertLocalTestStack();
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword(user);
  if (error || !data.user) throw new Error("Test login failed: " + error?.message);
  return { client, userId: data.user.id };
}

export function anonClient(): SupabaseClient {
  assertLocalTestStack();
  return createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
}

// A real 8x8 red PNG image (generated in code, so no binary file is needed).
export const TEST_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGP4z8CAFTEMLQkAhgM/wdf2Xb0AAAAASUVORK5CYII=",
  "base64"
);

// Bigger than the 5 MB limit (starts with a PNG header).
export function oversizedPng(): Buffer {
  const big = Buffer.alloc(6 * 1024 * 1024, 0);
  TEST_PNG.copy(big, 0);
  return big;
}

export type SeedState = {
  sellerAId: string;
  buyerBId: string;
  productWithImage: { id: string; title: string; price: number; image: string; path: string };
  productNoImage: { id: string; title: string; price: number };
};

export function readState(): SeedState {
  return JSON.parse(readFileSync(join(__dirname, ".state.json"), "utf8"));
}
