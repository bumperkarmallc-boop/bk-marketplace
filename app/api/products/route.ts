import { NextResponse } from "next/server";

/**
 * TEMP in-memory product store (Phase 2)
 * This will be replaced by a database later
 */
type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const products: Product[] = [];

/**
 * GET /api/products
 * Returns all products
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    products,
  });
}

/**
 * POST /api/products
 * Creates a new product
 */
export async function POST(req: Request) {
  try {
    const { title, description, price } = await req.json();

    // Validation
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

    const newProduct: Product = {
      id: crypto.randomUUID(),
      title,
      description,
      price,
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
