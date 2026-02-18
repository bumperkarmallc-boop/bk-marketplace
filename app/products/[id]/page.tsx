import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
.eq("id", id)
    .single();

if (error) {
  console.log("SUPABASE ERROR:", error);
  return notFound();
}

if (!product) {
  console.log("NO PRODUCT FOUND");
  return notFound();
}

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>{product.title}</h1>

      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        ${product.price.toFixed(2)}
      </p>

      <p style={{ marginTop: "1.5rem", opacity: 0.8 }}>
        {product.description}
      </p>
    </div>
  );
}
