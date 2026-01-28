export default function CreateProductPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Create Product</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Phase 1 — Product details setup. Uploads and pricing come next.
      </p>

      <form className="space-y-6">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Title
          </label>
          <input
            type="text"
            placeholder="e.g. Chaos Angel Tee"
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe the product..."
            rows={4}
            className="w-full rounded-md border px-3 py-2 bg-background"
          />
        </div>

        {/* Image Upload (placeholder) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Images
          </label>
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Image upload coming next phase
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="button"
            disabled
            className="rounded-md px-4 py-2 bg-muted text-muted-foreground cursor-not-allowed"
          >
            Save Product (coming soon)
          </button>
        </div>
      </form>
    </div>
  );
}
