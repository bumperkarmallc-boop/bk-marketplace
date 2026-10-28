"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  PRODUCT_IMAGE_BUCKET,
  checkProductImage,
  productImagePath,
} from "@/lib/productImages";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return; // ignore double clicks
    setMessage(null);

    // Prices are stored in whole dollars for now
    const priceNumber = Number(price);
    if (!Number.isInteger(priceNumber) || priceNumber < 0) {
      setMessage("Please enter the price in whole dollars (for example 25).");
      return;
    }

    if (imageFile) {
      const problem = checkProductImage(imageFile);
      if (problem) {
        setMessage(problem);
        return;
      }
    }

    setSaving(true);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please log in first.");
      setSaving(false);
      return;
    }

    // 1) Upload the image (optional) into this user's own folder
    let imageUrl: string | null = null;
    let imagePath: string | null = null;

    if (imageFile) {
      imagePath = productImagePath(user.id, imageFile);
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(imagePath, imageFile, {
          contentType: imageFile.type,
          upsert: false, // never overwrite an existing file
        });

      if (uploadError) {
        setMessage("Image upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      imageUrl = supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .getPublicUrl(imagePath).data.publicUrl;
    }

    // 2) Create the product
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          title,
          description,
          price: priceNumber,
          image: imageUrl,
          user_id: user.id,
        },
      ])
      .select("id")
      .single();

    if (error) {
      // Don't leave an unused image behind if the product wasn't saved
      if (imagePath) {
        await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([imagePath]);
      }
      setMessage("Could not save the product: " + error.message);
      setSaving(false);
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
            step="1"
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

        {/* IMAGE (optional) */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Product Image (optional — PNG, JPG, WEBP or GIF, up to 5 MB)
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            style={{ color: "#fff" }}
          />
        </div>

        {message && (
          <p style={{ color: "#f87171", marginBottom: "1rem" }}>{message}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "0.9rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Publish Product"}
        </button>
      </form>
    </div>
  );
}
