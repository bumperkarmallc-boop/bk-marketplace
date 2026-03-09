"use client";
import { useRouter } from "next/navigation";
type Props = {
  id: string;
  title: string;
  price: number;
};

export default function AddToCartButton({ id, title, price }: Props) {
const router = useRouter();
  const addToCart = () => {
const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

const existingItem = existingCart.find(
  (item: any) => item.id === id
);

if (existingItem) {
  existingItem.quantity += 1;
} else {
  existingCart.push({
    id,
    title,
    price,
    quantity: 1,
  });
}

localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Added to cart");
router.push("/cart");
  };

  return (
    <button
      onClick={addToCart}
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
