type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.product ?? null;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <p className="text-muted-foreground mb-6">
        {product.description}
      </p>

      <p className="text-xl font-bold mb-8">
        ${product.price.toFixed(2)}
      </p>

      <button className="px-6 py-3 bg-black text-white rounded">
        Buy Now
      </button>
    </div>
  );
}
