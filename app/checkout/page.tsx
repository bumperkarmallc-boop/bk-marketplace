"use client"

import { useEffect, useState } from "react"
import { clearCart, getCart, useCart } from "@/lib/cartStore"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function CheckoutPage() {

  const cart = useCart()

  // Nothing to check out: go back to the cart page.
  // (Reads the saved cart directly, so it is not fooled by the brief empty
  // first render before the browser's saved cart is loaded.)
  useEffect(() => {
    if (getCart().length === 0) {
      window.location.href = "/cart"
    }
  }, [])
const subtotal = cart.reduce((sum, item) => {
  return sum + Number(item.price) * item.quantity
}, 0)
  const [submitting, setSubmitting] = useState(false)

  // The order is created by the database function `place_order`.
  // The browser sends only product IDs and quantities; the database looks up
  // the real prices and calculates the total, so prices cannot be faked here.
  const createOrder = async () => {
    if (submitting) return // ignore double clicks
    setSubmitting(true)

    const { data: { user } } = await supabaseBrowser.auth.getUser()

    if (!user) {
      alert("Please log in first")
      setSubmitting(false)
      return
    }

    const items = cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }))

    const { error } = await supabaseBrowser.rpc("place_order", { items })

    if (error) {
      console.error("ORDER ERROR:", error)
      alert("Order failed: " + error.message)
      setSubmitting(false)
      return
    }

    clearCart()
    window.location.href = "/orders"
  }

  return (

    <div style={{ padding: "2rem" }}>

      <h1>Checkout</h1>

      {cart.map((item, i) => (
        <div key={i} style={{ marginTop: "1rem" }}>
          {item.title} — ${item.price} x {item.quantity}
        </div>
      ))}

      <h3 style={{ marginTop: "2rem" }}>
        Subtotal: ${subtotal}
      </h3>

      <button
        onClick={createOrder}
        disabled={submitting}
        style={{
          marginTop: "2rem",
          padding: "10px 18px",
          background: "black",
          color: "white",
          border: "none",
          cursor: submitting ? "not-allowed" : "pointer"
        }}
      >
        Continue to Payment
      </button>

    </div>

  )

}
