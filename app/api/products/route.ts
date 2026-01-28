import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, price } = await req.json();

    // Basic validation
    if (!title || !description || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a number greater than 0" },
        { status: 400 }
      );
    }

    // TEMP response (no DB yet)
    return NextResponse.json({
      success: true,
      product: {
        title,
        description,
        price,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
