"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser()

      if (!user) return

      const { data } = await supabaseBrowser
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setOrders(data)
      }
    }

    loadOrders()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 && (
        <p>No orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
