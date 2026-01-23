export default function Nav() {
  return (
    <nav
      style={{
        padding: "12px 24px",
        fontSize: "14px",
        opacity: 0.7,
      }}
    >
      <ul
        style={{
          display: "flex",
          gap: "16px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/explore">Explore</a>
        </li>
        <li>
          <a href="/sell">Sell</a>
        </li>
<li>
  <a href="/creator/products">Creator</a>
</li>
    
    <li>
          <a href="/how-it-works">How It Works</a>
        </li>
      </ul>
    </nav>
  );
}
