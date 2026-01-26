import Link from "next/link";

export default function CreatorProductsPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Creator Products</h1>

      <Link
        href="/creator/products/new"
        className="inline-block border border-white/30 rounded-lg px-5 py-2 text-sm opacity-80 mb-6"
      >
        Create Product
      </Link>

      <p className="mb-6">
        This page is used by creators to add and manage anything they sell.
        Physical. Digital. Services. Experiences. No boxes. No limits.
      </p>

      <h2 className="text-xl font-semibold mb-2">What you can sell</h2>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>Physical products (apparel, art, merch, handmade goods)</li>
        <li>Digital products (downloads, presets, PDFs, music, designs)</li>
        <li>Services (custom work, consulting, commissions)</li>
        <li>Experiences (events, access, memberships)</li>
        <li>Anything you create and own the rights to</li>
      </ul>

      <p className="text-sm opacity-80 mb-2">
        Categories exist for clarity — not control. Creators decide what they sell.
      </p>

      <p className="text-xs text-gray-500">
        More creator tools coming next.
      </p>
    </main>
  );
}

