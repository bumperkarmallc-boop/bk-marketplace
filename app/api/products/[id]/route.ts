import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Returns one real product from the database (public listing fields only).
// Previously this returned a hard-coded fake product.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, title, description, price, image, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // Most often an ID that is not in the right format
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
