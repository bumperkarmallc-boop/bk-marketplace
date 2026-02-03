"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-hide success banner after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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

      // Success feedback + clear form
      setSuccess("Product submitted successfully.");
      setTitle("");
      setDescription("");
      setPrice("");
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

      {success && (
        <div className="mb-6 rounded-md bg-green-600 px-4 py-3 text-white font-semibold">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-600 px-4 py-3 text-white font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            placeholder="e.g. Chaos Angel Tee"
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            placeholder="Describe the product..."
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
            placeholder="19.99"
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-white text-black py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "
