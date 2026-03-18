"use client"

import { useEffect, useState } from "react"
import { getCart } from "@/lib/cartStore"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function CheckoutPage() {

  const [cart, setCart] = useState<any[]>([])

useEffect(() => {
  const items = getCart()

  if (items.length === 0) {
    window.location.href = "/cart"
    return
  }

  setCart(items)
}, [])
const subtotal = cart.reduce((sum, item) => {
  return sum + Number(item.price) * item.quantity
}, 0)
  const createOrder = async () => {

    const { data: { user } } = await supabaseBrowser.auth.getUser()

    if (!user) {
      alert("Please log in first")
      return
    }


     const { data, error } = await supabaseBrowser
        .from("orders")
.insert({
 buyer_id: user.id,
total: subtotal,
})
.select()
const orderId = data[0].id
      if (error) {
        console.error("ORDER ERROR:", error)
        alert("Order failed")
        return
      }

// save items to order_items
const itemsToInsert = cart.map(item => ({
order_id: orderId,
  product_id: item.id,
  quantity: item.quantity,
  price: item.price
}))

await supabaseBrowser.from("order_items").insert(itemsToInsert)
window.location.href = "/orders"
    localStorage.removeItem("cart")
    setCart([])

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
        style={{
          marginTop: "2rem",
          padding: "10px 18px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Continue to Payment
      </button>

    </div>

  )

}
