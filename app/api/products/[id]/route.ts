import { NextResponse } from "next/server";

const products = [
  {
    id: "test-1",
    title: "test tee",
    description: "test",
    price: 19.99,
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ product });
}
