export default function SellPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Your Work. Zero Apologies. No Permission Needed.
      </h1>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeg-i3LZKGXoNujxFRvO3D9r1FvyvBBJd6Z61-DjVmyvw/viewform?usp=header"
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
        Bumper Karma isn’t built for everyone — and that’s intentional.
        This is a marketplace for creators with a point of view.
        Original work. Real voice. No filler.
      </p>

      <p className="text-gray-400 text-sm mt-4">
        If you’re here to upload something just to see if it sells,
        this probably isn’t your lane.
      </p>

      <p className="text-center text-sm text-gray-500 mt-6">
        Early access is limited. We’re building quality first — not volume.
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

        <p className="text-gray-300">
          If you choose not to continue after 7 days,
          you can leave with no charges and no obligation.
        </p>
      </div>
    </main>
  );
}
