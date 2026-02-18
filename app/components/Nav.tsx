import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #333",
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ fontWeight: "bold" }}>
        Bumper Karma
      </Link>

      <Link href="/explore">
        Explore
      </Link>

      <Link href="/sell">
        Sell
      </Link>

      <Link href="/creator/products">
        Creator
      </Link>

      <Link href="/how-it-works">
        How It Works
      </Link>
    </nav>
  );
}
