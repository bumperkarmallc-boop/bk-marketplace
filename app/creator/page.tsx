export default function CreatorPage() {
  return (
    <main className="min-h-screen p-8 text-center">
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

      <h1 className="text-4xl font-bold mb-4">Creator Hub</h1>

      <p className="text-lg max-w-xl mx-auto mb-8 opacity-90">
        This is your command center. Manage products, listings, and everything
        you sell on Bumper Karma.
      </p>

<div className="mt-6 text-sm opacity-80">
  <p>
    Creator access is open. Upload what you want — just follow the rules.
    No minors. No stolen work. No illegal content.
  </p>
  <p className="mt-2 opacity-70">
    Phase 1 is self-serve. Abuse it and you’re gone.
  </p>
</div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/creator/products"
          className="border border-white/30 rounded-lg px-6 py-3 hover:bg-white/10 transition"
        >
          Manage Products
        </a>

        <a
          href="/creator/listings"
          className="border border-white/30 rounded-lg px-6 py-3 hover:bg-white/10 transition"
        >
          View Listings
        </a>
      </div>

    </main>
  );
}
