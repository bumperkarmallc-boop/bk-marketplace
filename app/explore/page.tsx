import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ExplorePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Explore</h1>
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error loading products: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "960px" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Explore</h1>
        <p style={{ marginTop: "0.75rem", opacity: 0.8 }}>
          Real work. Real creators. No hype, no filler.
          <br />
          What’s live is what’s for sale — nothing more, nothing fake.
        </p>
      </header>

      {products && products.length === 0 ? (
        <div style={{ opacity: 0.85 }}>
          <p style={{ fontSize: "1.1rem" }}>
            Nothing live right now.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            When creators drop something worth owning, it shows up here.
            No placeholders. No mass junk. Just real releases.
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products?.map((product) => (
<li key={product.id} style={{ listStyle: "none" }}>
  <Link
    href={`/products/${product.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div
      style={{
        marginBottom: "2rem",
        padding: "1.5rem",
        border: "1px solid #333",
        borderRadius: "10px",
      }}
    >
      <h2>{product.title}</h2>

      <p style={{ fontWeight: "bold", marginTop: "0.5rem" }}>
        ${product.price.toFixed(2)}
      </p>

      <p style={{ marginTop: "0.75rem", opacity: 0.85 }}>
        {product.description}
      </p>
    </div>
  </Link>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}
