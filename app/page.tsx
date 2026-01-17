export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Bumper Karma Marketplace
      </h1>

      <p className="text-lg max-w-xl mb-10">
        A creator-first marketplace built for rebels, misfits, designers, and 
        anyone with something to say.  
        Upload your work. Sell your vision. Keep your freedom.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        
        <a
          href="/explore"

          className="border border-white/20 rounded-lg p-4 hover:bg-white/10 transition"
        >
          🌟 Explore Marketplace
        </a>

        <a  href="/explore"

          href="/sell"

          className="border border-white/20 rounded-lg p-4 hover:bg-white/10 transition"
        >
          ✨ Become a Seller
        </a>

        <a
          href="/how-it-works"

          className="border border-white/20 rounded-lg p-4 hover:bg-white/10 transition"
        >
          📚 Learn How It Works
        </a>

      </div>
    </main>
  );
}
