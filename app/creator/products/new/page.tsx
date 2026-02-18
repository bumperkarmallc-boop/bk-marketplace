"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No authenticated user");
      return;
    }
console.log("User ID:", user.id);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          title,
          description,
          price: Number(price),
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    router.push(`/products/${data.id}`);
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
        Add a Product
      </h1>

      <p style={{ opacity: 0.85, marginBottom: "2rem" }}>
        This creates a live listing. If it’s here, buyers can see it.
      </p>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Product Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #444",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #444",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* PRICE */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Price (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #444",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.9rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Publish Product
        </button>
      </form>
    </div>
  );
}
