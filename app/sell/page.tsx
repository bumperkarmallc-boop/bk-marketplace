const CREATOR_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeq-i3LZKGXoNujxFRVo3D9r1FvyBBJdfBz6ISJ-DjYmryw/viewform";

export default function SellPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Your Work. Zero Apologies. No Permission Needed.
      </h1>

      <a
        className="mt-6"
        href={CREATOR_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="inline-block mt-6 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          Join the Creator Waitlist
        </span>
      </a>

      <p className="text-lg text-gray-300 max-w-xl mt-10">
        A marketplace built for misfits, makers, and rulebreakers.
        No gatekeepers. No begging. Just create.
      </p>

      <p className="text-gray-400 text-sm mt-4">
        No gatekeepers. No begging. No bullshit.
      </p>

      <p className="text-gray-400 text-sm mt-4">
        Built for bold, unapologetic creators who want full control.
      </p>

      <div className="bg-gray-900 p-6 rounded-lg border border-white/20 max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-4">Why Sell on Bumper Karma?</h2>
        <ul className="text-left space-y-3 text-gray-300">
          <li>• Sell your own designs, products, or digital goods</li>
          <li>• Set your own prices and keep your brand voice</li>
          <li>• No algorithm games. No shadow bans</li>
          <li>• Built for bold, unfiltered creators</li>
        </ul>
      </div>
    </main>
  );
}
