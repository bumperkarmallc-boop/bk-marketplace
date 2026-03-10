"use client"

import { useEffect, useState } from "react"
import { getCart } from "@/lib/cartStore"

export default function CheckoutPage() {

  const [cart, setCart] = useState([])

  useEffect(() => {
    const items = getCart()
    setCart(items)
  }, [])

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.qty
  }, 0)

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout</h1>

      {cart.map((item) => (
        <div key={item.id}>
          {item.name} — ${item.price} × {item.qty}
        </div>
      ))}

      <h2>Subtotal: ${subtotal}</h2>

      <button style={{ marginTop: "20px" }}>
        Continue to Payment
      </button>
    </div>
  )
}
