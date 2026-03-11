"use client"

import { useEffect, useState } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const increase = (id: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
    updateCart(updated)
  }

  const decrease = (id: string) => {
    const updated = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    updateCart(updated)
  }

  const remove = (id: string) => {
    const updated = cart.filter(item => item.id !== id)
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
        <div key={item.id} style={{ marginBottom: "20px" }}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          <p>Qty: {item.quantity}</p>

          <button onClick={() => increase(item.id)}>+</button>
          <button onClick={() => decrease(item.id)}>-</button>
          <button onClick={() => remove(item.id)}>Remove</button>
        </div>
      ))}

<h2>Subtotal: ${subtotal.toFixed(2)}</h2>

<button
  style={{
    marginTop: "20px",
    padding: "12px 20px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  }}
  onClick={() => window.location.href = "/checkout"}
>
  Proceed to Checkout
</button>

</main>

  )
}
