export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

const supabase = await createSupabaseServerClient()

const {
  data: { session },
} = await supabase.auth.getSession()

const user = session?.user

if (!user) {
  return <div className="p-8">Unauthorized</div>
}

const { data: product } = await supabase
  .from("products")
  .select("*")
  .eq("id", id)
  .eq("user_id", user.id)
  .single()

  if (!product) {
    return <div className="p-8">Product not found</div>
  }

  async function updateProduct(formData: FormData) {
    "use server"

const supabase = await createSupabaseServerClient()

    const title = formData.get("title") as string
    const price = Number(formData.get("price"))

const {
  data: { session },
} = await supabase.auth.getSession()

const user = session?.user

    if (!user) return

    await supabase
      .from("products")
      .update({
        title,
        price,
      })
      .eq("id", id)
      .eq("user_id", user.id)

    revalidatePath("/creator/products")
    redirect("/creator/products")
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form action={updateProduct} className="flex flex-col gap-4">
        <input
          name="title"
          defaultValue={product.title}
          className="border p-2 rounded"
        />

        <input
          name="price"
          type="number"
          defaultValue={product.price}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  )
}
