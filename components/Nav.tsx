"use client";

import Link from "next/link";
import { useEffect, useState } from "react"
import { getCart } from "@/lib/cartStore"
export default function Nav() {
const [count, setCount] = useState(0)

useEffect(() => {
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + item.qty, 0)
  setCount(total)
}, [])
  return (
    <nav
      style={{
        background: "black",
        padding: "1rem",
        borderBottom: "1px solid #222",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link href="/">Bumper Karma</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/creator">Creator</Link>
        <Link href="/how-it-works">How It Works</Link>
<Link href="/cart">Cart ({count})</Link>
<Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
