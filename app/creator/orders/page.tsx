import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function CreatorOrdersPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please login to view your orders.</div>
  }

  // STEP 1: get your product IDs
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("user_id", user.id)

  const productIds = products?.map(p => p.id) || []

  // STEP 2: get order_items that use your products
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("order_id")
    .in("product_id", productIds)

  const orderIds = orderItems?.map(item => item.order_id) || []

  // STEP 3: get the actual orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .in("id", orderIds)
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Orders For Your Products</h1>

      {(!orders || orders.length === 0) && (
        <p>No orders yet.</p>
      )}

      {orders?.map(order => (
        <div
          key={order.id}
          style={{
            border: "1px solid #444",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
