import { NextResponse } from "next/server";

const products = [
  {
    id: "test-1",
    title: "test tee",
    description: "test",
    price: 19.99,
  },
];

export async function GET() {
  return NextResponse.json({ products });
}
