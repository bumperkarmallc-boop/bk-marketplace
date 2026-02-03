"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save product");
      }

      // Redirect to list page after successful save
setSuccess("Product submitted successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Create Product</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Add a new product to your creator catalog.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 bg-background"
            placeholder="e.g. Chaos Angel Tee"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full rounded-md border px-3 py-2 bg-background"
            placeholder="Describe the product…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 bg-background"
            placeholder="19.99"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
{success && (
  <p className="text-sm text-green-500">
    {success}
  </p>
)}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-white text-black py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Product"}
        </button>
      </form>
    </div>
  );
}
