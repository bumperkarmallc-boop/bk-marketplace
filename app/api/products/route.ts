import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("API RECEIVED PRODUCT:", body);

  return NextResponse.json({
    success: true,
    product: body,
  });
}
