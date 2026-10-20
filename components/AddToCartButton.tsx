"use client";

import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cartStore";

type Props = {
  id: string;
  title: string;
  price: number;
  seller_id: string | null;
};

export default function AddToCartButton({ id, title, price, seller_id }: Props) {
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({ product_id: id, seller_id, title, price });
    alert("Added to cart");
    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      style={{
        marginTop: "2rem",
        padding: "0.75rem 1.5rem",
        background: "white",
        color: "black",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Add to Cart
    </button>
  );
}
