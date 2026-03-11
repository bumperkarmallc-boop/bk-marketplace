"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
export default function CreatorOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await supabaseBrowser
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      setOrders(data || [])
    }

    loadOrders()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Product</th>
            <th className="text-left p-2">Buyer</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.product_id}</td>
              <td className="p-2">{order.buyer_id}</td>
              <td className="p-2">${order.price}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
