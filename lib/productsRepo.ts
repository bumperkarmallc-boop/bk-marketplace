// lib/productsRepo.ts

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
};

// In-memory fallback store (Phase 3B)
// This will be replaced by Supabase in Phase 3C
let products: Product[] = [];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function createProduct(input: {
  title: string;
  description: string;
  price: number;
}): Product {
  const product: Product = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    price: input.price,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  return product;
}

// Used only for testing / seeding
export function clearProducts() {
  products = [];
}
export async function deleteProduct(id: string) {
  products = products.filter((product) => product.id !== id)
}
