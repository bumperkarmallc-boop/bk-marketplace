export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">🔥 Explore Marketplace</h1>

      <p className="text-center text-lg text-gray-300 max-w-2xl mx-auto mb-12">
        Browse bold, unapologetic creations from rebels, misfits, outlaws,
        and independent designers chasing their own lanes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="p-6 border border-white/20 rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold mb-2">✨ Featured Designs</h2>
          <p className="text-gray-400">Top-selling artwork from BK creators.</p>
        </div>

        <div className="p-6 border border-white/20 rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold mb-2">🔥 Dark Humor Tees</h2>
          <p className="text-gray-400">Savage, spicy, and full of attitude.</p>
        </div>

        <div className="p-6 border border-white/20 rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold mb-2">🖤 Tattoo Flash-Inspired</h2>
          <p className="text-gray-400">Line-art and ink-inspired designs.</p>
        </div>

        <div className="p-6 border border-white/20 rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold mb-2">⭐ New Arrivals</h2>
          <p className="text-gray-400">Fresh drops from rising BK creators.</p>
        </div>

      </div>
    </main>
  );
}
