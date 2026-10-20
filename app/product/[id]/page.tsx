import { redirect } from "next/navigation";

// This older page always showed the same made-up "demo" product, which
// could never be ordered. Real product pages live at /products/[id].
export default async function OldProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/products/${id}`);
}
