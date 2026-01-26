"use client";
import Link from "next/link";
export default function CreatorProductsPage() {
  return (
    <main className="min-h-screen p-8">
     <div
  style={{
    marginBottom: "24px",
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    opacity: 0.85,
  }}
>
  <p style={{ fontSize: "14px", margin: 0 }}>
Creator access is limited while tools are being finalized for launch.
  </p>
</div>
 <h1 className="text-2xl font-bold mb-4">Creator Products</h1>
<div className="mb-6">
<div className="mb-6">
<a
<Link
  href="/creator/products/new"
  className="inline-block border border-white/30 rounded-lg px-5 py-2 text-sm opacity-80"
>
  Create Product
</Link>
</div>
</div>

      <p className="mb-6">
        This page is used by creators to add and manage anything they sell.
        Physical. Digital. Services. Experiences. No boxes. No limits.
      </p>

      <h2 className="text-xl font-semibold mb-2">What you can sell</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Physical products (apparel, art, merch, handmade goods)</li>
        <li>Digital products (downloads, presets, PDFs, music, designs)</li>
        <li>Services (custom work, consulting, commissions)</li>
        <li>Experiences (events, access, memberships)</li>
        <li>Anything else you create and own the rights to</li>
      </ul>

      <p className="mt-6 text-sm opacity-80">
        Categories exist for clarity — not control. Creators decide what they sell.
      </p>
<p className="mt-4 text-xs text-gray-500">More creator tools coming next.</p>

    </main>
  );
}
