export default function SellPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Your Work. Zero Apologies. No Permission Needed.
      </h1>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeq-i3LzKGXoNujxFRVo3D9r1FvvyBBJdfBzI65l-DjVmryww/viewform?usp=header"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6"
      >
        <span className="inline-block px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          Join the Creator Waitlist
        </span>
      </a>

      <p className="mt-3 text-sm text-gray-400">
        No payment required to start. Build first. Decide later.
      </p>

      <p className="text-lg text-gray-300 max-w-xl mt-10">
        A marketplace built for misfits, makers, and rulebreakers.
        No gatekeepers. No begging. Just create.
      </p>

      <p className="text-gray-400 text-sm mt-4">
        Built for bold, unapologetic creators who want full control.
      </p>

      <div className="mt-10 max-w-lg text-left border border-white/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">
          7-Day Seller Trial
        </h3>

        <p className="text-gray-300 mb-2">
          Sellers get 7 days to build their seller page, upload work,
          and decide if Bumper Karma is right for them.
        </p>

        <p className="text-gray-300 mb-2">
          No payment is required during the trial.
          Selling is disabled until a plan is activated.
        </p>

        <p className="text-gray-300 mb-2">
          If you choose not to continue after 7 days,
          you can leave with no charges and no obligation.
        </p>

        <p className="text-gray-300 mb-2">
          We give you time to build your seller page,
          upload your work, and see if Bumper Karma fits your chaos.
        </p>

        <p className="text-gray-300">
          No upfront fees. No pressure to launch.
          If you decide it’s not for you, you can walk away without
          it costing you anything.
        </p>

        <p className="text-gray-400 text-sm mt-3">
          Early sellers get access before the marketplace officially opens.
        </p>
      </div>
    </main>
  );
}
