"use client"

import { useEffect, useState } from "react"
import { getCart, saveCart, type CartItem } from "@/lib/cartStore"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    saveCart(newCart)
  }

  const increase = (productId: string) => {
    const updated = cart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
    )
    updateCart(updated)
  }

  const decrease = (productId: string) => {
    const updated = cart.map(item =>
      item.product_id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    updateCart(updated)
  }

  const remove = (productId: string) => {
    const updated = cart.filter(item => item.product_id !== productId)
    updateCart(updated)
  }

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  return (
    <main style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map(item => (
        <div key={item.product_id} style={{ marginBottom: "20px" }}>
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <p>Qty: {item.quantity}</p>

          <button onClick={() => increase(item.product_id)}>+</button>
          <button onClick={() => decrease(item.product_id)}>-</button>
          <button onClick={() => remove(item.product_id)}>Remove</button>
        </div>
      ))}

<h2>Subtotal: ${subtotal.toFixed(2)}</h2>

<button
disabled={cart.length === 0}
  style={{
    marginTop: "20px",
    padding: "12px 20px",
    background: "#fff",
    color: "#000",
    border: "none",
cursor: cart.length === 0 ? "not-allowed" : "pointer",
    fontWeight: "bold"
  }}
  onClick={() => window.location.href = "/checkout"}
>
  Proceed to Checkout
</button>

</main>

  )
}
