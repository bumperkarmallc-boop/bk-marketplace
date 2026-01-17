export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Creator Login</h1>

        <form className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-600 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Creator accounts coming soon.
        </p>
      </div>
    </main>
  );
}
