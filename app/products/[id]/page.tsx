import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductImage from "../../../components/ProductImage";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
.select("id, title, description, price, image, created_at, user_id")
    .eq("id", id)
    .single();

  if (error) {
    console.log("SUPABASE ERROR:", error);
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <ProductImage src={product.image} alt={product.title} height={420} />

      <h1 style={{ marginTop: "1.5rem" }}>{product.title}</h1>

      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        ${Number(product.price).toFixed(2)}
      </p>

      <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", opacity: 0.7 }}>
        Sold by an independent creator
      </p>

      <p style={{ marginTop: "1.5rem", opacity: 0.8 }}>
        {product.description}
      </p>

<AddToCartButton
  id={product.id}
  title={product.title}
  price={product.price}
  seller_id={product.user_id}
/>
    </div>
  );
}
