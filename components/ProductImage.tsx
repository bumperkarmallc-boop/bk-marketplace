// Shows a product's image, or a plain placeholder box when it has none.
// Uses a normal <img> on purpose: it works on any host for free, while
// Next.js image optimization depends on the hosting plan.
type Props = {
  src: string | null | undefined
  alt: string
  height?: number
}

export default function ProductImage({ src, alt, height = 280 }: Props) {
  if (!src) {
    return (
      <div
        style={{
          height,
          borderRadius: "8px",
          border: "1px dashed #444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
          fontSize: "0.9rem",
        }}
      >
        No image yet
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height,
        objectFit: "contain",
        borderRadius: "8px",
        background: "#111",
      }}
    />
  )
}
