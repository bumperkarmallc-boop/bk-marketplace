"use client"

import { useEffect, useState } from "react"
import { getCart } from "@/lib/cartStore"
import { supabaseBrowser } from "@/lib/supabase-browser"
export default function CheckoutPage() {

  const [cart, setCart] = useState([])

  useEffect(() => {
    const items = getCart()
    setCart(items)
  }, [])

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.qty
  }, 0)
const createOrder = async () => {
  const { data: { user } } = await supabaseBrowser.auth.getUser()

  if (!user) {
    alert("Please log in first")
    return
  }

  for (const item of cart) {
    await supabaseBrowser.from("orders").insert({
      buyer_id: user.id,
      product_id: item.id,
      seller_id: item.seller_id,
      price: item.price,
      status: "pending"
    })
  }

  alert("Order created")
}
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout</h1>

      {cart.map((item) => (
        <div key={item.id}>
          {item.name} — ${item.price} × {item.qty}
        </div>
      ))}

      <h2>Subtotal: ${subtotal}</h2>
<button style={{ marginTop: "20px" }} onClick={createOrder}>
        Continue to Payment
      </button>
    </div>
  )
}
