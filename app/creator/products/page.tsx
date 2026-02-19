import { createSupabaseServerClient } from "@/lib/supabase-server"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function CreatorProductsPage() {
  const supabase = await createSupabaseServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8">Unauthorized</div>
  }

  // Delete product (server action)
  async function deleteProduct(formData: FormData) {
    "use server"

    const supabase = await createSupabaseServerClient()
    const id = formData.get("id") as string

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    revalidatePath("/creator/products")
  }

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Products</h1>

      {products && products.length === 0 && <p>No products yet.</p>}

      <div className="space-y-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-400">${product.price}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/products/${product.id}`}
                className="text-blue-500 underline"
              >
                View
              </Link>

              <Link
                href={`/creator/products/${product.id}/edit`}
                className="text-blue-600 underline"
              >
                Edit
              </Link>

              <form action={deleteProduct}>
                <input type="hidden" name="id" value={product.id} />
                <button
                  type="submit"
                  className="text-red-500 underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
