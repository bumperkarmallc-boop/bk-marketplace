// Automated browser tests for the marketplace working branch.
// Run ONLY against the temporary local test Supabase and the site started on
// GitHub's build server. All accounts, products, images and orders are fake.
import { expect, test, type Page } from "@playwright/test";
import {
  BUCKET, BUYER_B, SELLER_A, TEST_PNG, adminClient, anonClient, oversizedPng,
  readState, signedInClient,
} from "./helpers";

test.describe.configure({ mode: "serial" });

async function login(page: Page, user: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(user.email);
  await page.getByPlaceholder("Password").fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/creator/products");
}

async function imageLoaded(page: Page, alt: string) {
  const img = page.getByRole("img", { name: alt }).first();
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  return img;
}

// ---------------------------------------------------------------- 1
test("T1 Explore lists products and a product page shows its image", async ({ page }) => {
  const s = readState();
  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: s.productWithImage.title })).toBeVisible();
  await imageLoaded(page, s.productWithImage.title);
  await expect(page.getByRole("heading", { name: s.productNoImage.title })).toBeVisible();
  await expect(page.getByText("No image yet").first()).toBeVisible();

  await page.getByRole("heading", { name: s.productWithImage.title }).click();
  await page.waitForURL(`**/products/${s.productWithImage.id}`);
  await expect(page.getByRole("heading", { level: 1, name: s.productWithImage.title })).toBeVisible();
  await expect(page.getByText("$25.00")).toBeVisible();
  await imageLoaded(page, s.productWithImage.title);
});

// ---------------------------------------------------------------- 2 + 3
test("T2/T3 Seller creates a product with an image; the image shows on its page", async ({ page }) => {
  const s = readState();
  const title = "E2E New Hoodie " + Date.now();
  await login(page, SELLER_A);
  await page.goto("/creator/products/new");
  await page.locator('input[type="text"]').fill(title);
  await page.locator("textarea").fill("Created by the automated test (fake)");
  await page.locator('input[type="number"]').fill("40");
  await page.locator('input[type="file"]').setInputFiles({ name: "hoodie.png", mimeType: "image/png", buffer: TEST_PNG });
  await page.getByRole("button", { name: "Publish Product" }).click();
  await page.waitForURL(/\/products\/[0-9a-f-]{36}$/);

  const img = await imageLoaded(page, title);
  const src = await img.getAttribute("src");
  expect(src).toContain(`/${BUCKET}/${s.sellerAId}/`); // stored in seller A's own folder

  // The database has the product with that image, owned by seller A
  const { data } = await adminClient().from("products").select("price,image,user_id").eq("title", title).single();
  expect(data).toMatchObject({ price: 40, image: src, user_id: s.sellerAId });
});

// ---------------------------------------------------------------- 4
test("T4 Cart, checkout and cart count stay in sync; order total uses the real price", async ({ page }) => {
  const s = readState();
  await login(page, BUYER_B);
  await page.goto(`/products/${s.productWithImage.id}`);
  await page.getByRole("button", { name: "Add to Cart" }).click(); // alert() is auto-dismissed
  await page.waitForURL("**/cart");
  await expect(page.getByText("Qty: 1")).toBeVisible();

  await page.goto(`/products/${s.productWithImage.id}`);
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.waitForURL("**/cart");
  await expect(page.getByText("Qty: 2")).toBeVisible();

  await page.getByRole("button", { name: "+" }).click();
  await expect(page.getByText("Qty: 3")).toBeVisible();
  await expect(page.getByText("Subtotal: $75.00")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart (3)" })).toBeVisible();

  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await page.waitForURL("**/checkout");
  await expect(page.getByText(`${s.productWithImage.title} — $25 x 3`)).toBeVisible();
  await expect(page.getByText("Subtotal: $75")).toBeVisible();

  // Tamper: change the price saved in the browser to $1 before ordering
  await page.evaluate(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    for (const item of cart) item.price = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
  });

  await page.getByRole("button", { name: "Continue to Payment" }).click();
  await page.waitForURL("**/orders");

  const admin = adminClient();
  const { data: order } = await admin.from("orders").select("id,total,status")
    .eq("buyer_id", s.buyerBId).order("created_at", { ascending: false }).limit(1).single();
  expect(order?.total).toBe(75); // real price 25 x 3, not the tampered $1
  expect(order?.status).toBe("pending"); // not marked paid
  const { data: items } = await admin.from("order_items").select("product_id,quantity,price").eq("order_id", order!.id);
  expect(items).toEqual([{ product_id: s.productWithImage.id, quantity: 3, price: 25 }]);

  // Cart is cleared after the order
  expect(await page.evaluate(() => localStorage.getItem("cart"))).toBeNull();
});

// ---------------------------------------------------------------- 5
test("T5 Product detail API returns the real product and hides the seller ID", async ({ request }) => {
  const s = readState();
  const res = await request.get(`/api/products/${s.productWithImage.id}`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toMatchObject({
    id: s.productWithImage.id, title: s.productWithImage.title, price: 25, image: s.productWithImage.image,
  });
  expect(body).not.toHaveProperty("user_id");

  expect((await request.get("/api/products/00000000-0000-4000-a000-000000000000")).status()).toBe(404);
  expect((await request.get("/api/products/not-a-real-id")).status()).toBe(404);
});

// ---------------------------------------------------------------- 6
test("T6 Users cannot upload, replace or delete images in another user's folder", async () => {
  const s = readState();
  const admin = adminClient();
  const b = await signedInClient(BUYER_B);
  const a = await signedInClient(SELLER_A);
  const aFile = s.productWithImage.path;
  const original = await (await admin.storage.from(BUCKET).download(aFile)).data!.arrayBuffer();

  // B cannot upload into A's folder
  const intoA = await b.client.storage.from(BUCKET).upload(`${s.sellerAId}/intruder.png`, TEST_PNG, { contentType: "image/png" });
  expect(intoA.error, "upload into another user's folder must fail").not.toBeNull();

  // B cannot replace A's image
  const replace = await b.client.storage.from(BUCKET).upload(aFile, oversizedPng().subarray(0, 100), { contentType: "image/png", upsert: true });
  expect(replace.error, "replacing another user's image must fail").not.toBeNull();

  // B cannot delete A's image (Storage reports nothing deleted)
  const del = await b.client.storage.from(BUCKET).remove([aFile]);
  expect(del.data ?? []).toHaveLength(0);

  // A's image is still there and unchanged
  const after = await admin.storage.from(BUCKET).download(aFile);
  expect(after.error).toBeNull();
  expect(Buffer.from(await after.data!.arrayBuffer()).equals(Buffer.from(original))).toBe(true);

  // Logged-out visitors cannot upload
  const anonUp = await anonClient().storage.from(BUCKET).upload(`anon/x.png`, TEST_PNG, { contentType: "image/png" });
  expect(anonUp.error).not.toBeNull();

  // Limits enforced by Supabase itself: over 5 MB and non-images refused
  const big = await b.client.storage.from(BUCKET).upload(`${s.buyerBId}/big.png`, oversizedPng(), { contentType: "image/png" });
  expect(big.error, "6 MB image must be refused").not.toBeNull();
  const txt = await b.client.storage.from(BUCKET).upload(`${s.buyerBId}/note.txt`, Buffer.from("hello"), { contentType: "text/plain" });
  expect(txt.error, "non-image must be refused").not.toBeNull();

  // Positive controls: B can upload into B's own folder; A can delete A's own file
  const own = await b.client.storage.from(BUCKET).upload(`${s.buyerBId}/own.png`, TEST_PNG, { contentType: "image/png" });
  expect(own.error).toBeNull();
  const tmp = `${s.sellerAId}/temp-delete-me.png`;
  expect((await a.client.storage.from(BUCKET).upload(tmp, TEST_PNG, { contentType: "image/png" })).error).toBeNull();
  const aDel = await a.client.storage.from(BUCKET).remove([tmp]);
  expect(aDel.data ?? []).toHaveLength(1);

  // Public viewing still works (no login)
  const res = await fetch(s.productWithImage.image);
  expect(res.status).toBe(200);
});

// ---------------------------------------------------------------- 7
test("T7 Add a Product rejects cents, oversized images and non-images, and saves nothing", async ({ page }) => {
  await login(page, SELLER_A);
  const fill = async (title: string, price: string) => {
    await page.goto("/creator/products/new");
    await page.locator('input[type="text"]').fill(title);
    await page.locator("textarea").fill("Should not be saved (fake)");
    await page.locator('input[type="number"]').fill(price);
  };

  await fill("E2E Reject Cents", "19.99");
  await page.getByRole("button", { name: "Publish Product" }).click();
  await expect(page.getByText(/whole dollars/i)).toBeVisible();

  await fill("E2E Reject Big", "20");
  await page.locator('input[type="file"]').setInputFiles({ name: "big.png", mimeType: "image/png", buffer: oversizedPng() });
  await page.getByRole("button", { name: "Publish Product" }).click();
  await expect(page.getByText(/5 MB or smaller/i)).toBeVisible();

  await fill("E2E Reject PDF", "20");
  await page.locator('input[type="file"]').setInputFiles({ name: "doc.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 fake") });
  await page.getByRole("button", { name: "Publish Product" }).click();
  await expect(page.getByText(/Only PNG, JPG, WEBP or GIF/i)).toBeVisible();

  const { count } = await adminClient().from("products").select("id", { count: "exact", head: true }).like("title", "E2E Reject%");
  expect(count).toBe(0);
});
