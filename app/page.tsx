import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "3rem 2rem", maxWidth: "960px" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1>Bumper Karma</h1>

        <p style={{ marginTop: "1rem", fontSize: "1.1rem", opacity: 0.85 }}>
          A marketplace for creators who don’t do fake drops, filler products,
          or mass junk.
          <br />
          What’s listed is real. What’s live is for sale.
        </p>

      </header>

      <section style={{ marginBottom: "3rem" }}>
        <h2>What makes this different</h2>
        <p style={{ marginTop: "0.75rem", opacity: 0.85 }}>
          Bumper Karma isn’t a storefront full of placeholders.
          There are no “coming soon” pages pretending to be products.
          <br />
          If something is here, it was put here by a real creator and meant to be sold.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>For buyers</h2>
        <p style={{ marginTop: "0.75rem", opacity: 0.85 }}>
          Browse what’s actually available right now.
          No inflated drops. No countdown hype.
          Just work worth looking at.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/explore">Go to Explore →</Link>
        </div>
      </section>

      <section>
        <h2>For creators</h2>
        <p style={{ marginTop: "0.75rem", opacity: 0.85 }}>
          Publish products directly.
          No draft limbo. No fake previews.
          When you list it, buyers can see it.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/creator/products">Go to Creator →</Link>
        </div>
      </section>
    </div>
  );
}
