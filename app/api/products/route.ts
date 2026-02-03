import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    products: [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      product: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
