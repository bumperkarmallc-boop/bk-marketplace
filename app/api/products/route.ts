import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient()

  const body = await req.json()
  const { title, description, price } = body

  if (!title || !price) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  // 🔐 Get current authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title,
        description,
        price,
      },
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
