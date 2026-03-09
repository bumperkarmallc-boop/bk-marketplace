"use client"

import { useRouter } from "next/navigation"
import { addToCart } from "@/lib/cartStore"

export default function ProductPage() {

  const router = useRouter()

  const product = {
    id: "demo-shirt",
    name: "Bumper Karma Tee",
    price: 20
  }

  function handleAddToCart() {
    addToCart(product)
    router.push("/cart")
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{product.name}</h1>

      <p>${product.price}</p>

      <button onClick={handleAddToCart}>
        Add To Cart
      </button>

    </div>
  )
}
