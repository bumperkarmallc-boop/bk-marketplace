"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
// Use the same logged-in browser client as the rest of the site, so the
// database knows who is asking (the old standalone client had no login).
import { supabaseBrowser as supabase } from "@/lib/supabase-browser"

type Order = { id: string; total: number | null; status: string | null }
type OrderItem = { id: string; product_id: string | null; quantity: number | null; price: number | null }
type ProductTitle = { id: string; title: string }

export default function OrderDetailsPage() {
const params = useParams()
const id =
  typeof params.id === "string"
    ? params.id
    : Array.isArray(params.id)
    ? params.id[0]
    : ""
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
const [products, setProducts] = useState<ProductTitle[]>([])

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()

      setOrder(data)

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
.eq("order_id", id as string)
console.log("ITEMS DATA:", itemsData)
      setItems(itemsData || [])
const productIds = (itemsData || []).map(item => item.product_id)

const { data: productsData } = await supabase
  .from("products")
  .select("*")
  .in("id", productIds)

setProducts(productsData || [])
    }

    if (id) fetchOrder()
  }, [id])

  if (!order) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
    <h1>Order Details</h1>

      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h3 style={{ marginTop: "20px" }}>Items</h3>

      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        items.map((item) => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
<p>Product: {products.find(p => p.id === item.product_id)?.title || item.product_id}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))
      )}
    </div>
  )
}
