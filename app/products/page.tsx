import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.products ?? [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {products.length === 0 && (
        <p className="text-muted-foreground">
          No products available yet.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block border rounded-lg p-4 hover:bg-muted transition"
          >
            <h2 className="font-semibold mb-1">
              {product.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-3">
              {product.description}
            </p>

            <p className="font-bold">
              ${product.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
