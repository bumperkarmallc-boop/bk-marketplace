'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()

      setOrder(data)
    }

    if (id) fetchOrder()
  }, [id])

  if (!order) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Details</h2>

      <div style={{ border: "1px solid #333", padding: "15px", marginTop: "20px" }}>
        <p><strong>Order ID:</strong> {order.id}</p>
<p><strong>Total:</strong> ${order.price}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
      </div>
    </div>
  )
}
