export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
<h1 className="text-5xl font-bold mb-4">
  Buy bold. Sell louder.
</h1>

<p className="text-lg max-w-xl mb-10 opacity-90">
  Bumper Karma is a creator-first marketplace for people who don’t ask permission.
</p>

<div className="flex flex-col gap-4 w-full max-w-md">
  <a
    href="/explore"
    className="border border-white/30 rounded-lg p-4 hover:bg-white/10 transition"
  >
    🛒 Shop the Chaos
  </a>

  <a
    href="/sell"
    className="border-2 border-white rounded-lg p-4 font-bold hover:bg-white/10 transition"
  >
   💀 Sell Your Chaos
  </a>
</div>

    </main>
  );
}
