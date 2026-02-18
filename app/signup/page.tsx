"use client"

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Signup successful. You can now log in.")
    router.push("/login")
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
