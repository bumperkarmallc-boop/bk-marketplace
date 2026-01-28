"use client";

import { useState } from "react";

export default function CreateProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
        }),
      });

      const data = await res.json();
      console.log("Saved product:", data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2">Create Product</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Phase 1 — Product details setup. Uploads and pricing come next.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chaos Angel Tee"
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            className="w-full rounded-md border px-3 py-2 bg-background"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Images
          </label>
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Image upload coming next phase
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
