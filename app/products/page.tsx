import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>All Products</h1>
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error loading products: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "960px" }}>
      <h1>All Products</h1>

      {!products || products.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No products available yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product.id} style={{ marginBottom: "2rem" }}>
              <Link href={`/products/${product.id}`}>
                <div
                  style={{
                    padding: "1.5rem",
                    border: "1px solid #333",
                    borderRadius: "10px",
                  }}
                >
                  <h2>{product.title}</h2>
                  <p style={{ fontWeight: "bold" }}>
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <p>{product.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
