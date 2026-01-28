"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export default function CreatorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProduct() {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: Number(price), // 🔑 CRITICAL FIX
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to save product");
      return;
    }

    setProducts((prev) => [...prev, data.product]);
    setTitle("");
    setDescription("");
    setPrice("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-2xl font-bold">Your Products</h1>

      {/* CREATE PRODUCT */}
      <div className="space-y-4 border p-4 rounded-lg">
        <input
          className="w-full p-2 border rounded"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Price (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={handleSaveProduct}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Save Product
        </button>
      </div>

      {/* PRODUCT LIST */}
      {loading && <p className="text-muted-foreground">Loading products…</p>}

      {!loading && products.length === 0 && (
        <p className="text-muted-foreground">
          No products yet. Create one above.
        </p>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
            <span className="font-semibold">
              ${product.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
