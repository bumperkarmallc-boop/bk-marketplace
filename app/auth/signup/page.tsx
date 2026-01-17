import { signupAction } from "./action";
import { useFormState } from "react-dom";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl border border-zinc-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Creator Signup</h1>

        <form action={signupAction} className="space-y-4">

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}
        
        {state?.success && (
          <p className="text-green-400 text-sm">Signup successful! 🎉</p>
        )}
        
        
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-gray-300">
              I agree to the terms of service.
            </span>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Become a Creator
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account? Login coming soon.
        </p>
      </div>
    </main>
  );
}
