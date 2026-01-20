export default function SellPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Your Work. Zero Apologies. No Permission Needed.
      </h1>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeq-i3LzKGXoNujxFRVo3D9r1FvvyBBJdfBzI65l-DjVmryww/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6"
      >
        <span className="inline-block px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          Join the Creator Waitlist
        </span>
      </a>

      <p className="text-lg text-gray-300 max-w-xl mt-10">
        A marketplace built for misfits, makers, and rulebreakers.
        No gatekeepers. No begging. Just create.
      </p>

      <p className="text-gray-400 text-sm mt-4">
        Built for bold, unapologetic creators who want full control.
      </p>

      <div className="bg-gray-900 p-6 rounded-lg border border-white/20 max-w-lg mt-10 text-left">
        <h2 className="text-2xl font-semibold mb-4">
          Why Sell on Bumper Karma?
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>• Sell your own designs, products, or digital goods</li>
          <li>• Set your own prices and keep your voice</li>
          <li>• No algorithm games. No shadow bans.</li>
          <li>• Built for bold, unfiltered creators</li>
        </ul>
      </div>
    </main>
  );
}
