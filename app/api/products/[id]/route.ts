import { NextResponse } from 'next/server';

const products = [
  {
    id: 'test-1',
    title: 'test-ee',
    description: 'test',
    price: 19.99,
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
