export default function CreatorPage() {
  return (
    <main className="min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Creator Hub</h1>

      <p className="text-lg max-w-xl mx-auto mb-8 opacity-90">
        This is your command center. Manage products, listings, and everything
        you sell on Bumper Karma.
      </p>

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
