"use client";

export default function UploadPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("price", e.target.price.value);
    formData.append("image", e.target.image.files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("upload failed");
        return;
      }

      console.log("upload successful");
    } catch (err) {
      console.error("Error uploading:", err);
    }
  };

  return (
    <main className="text-white p-10 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Upload New Product</h1>

      <form className="space-y-6 max-w-lg"
       onSubmit={handleSubmit}
       encType="multipart/form-data"
>

        {/* Product Title */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Product Title</label>
          <input
            type="text"
            name="title"
            placeholder="Badass biker tee..."
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            placeholder="Tell the world what this design is about..."
            className="p-3 rounded bg-gray-900 border border-gray-700 h-28"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Price</label>
          <input
            type="number"
            name="price"
            placeholder="19.99"
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />
        </div>

    
{/* Upload Image */}
<div className="flex flex-col space-y-2">
    <label className="font-semibold">Product Image</label>
    <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        className="p-3 rounded bg-gray-900 border border-gray-700"
    />
</div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-gray-800 p-4 rounded-lg border border-white/20 hover:bg-gray-700 transition"
        >
          Upload Product
        </button>
      </form>
    </main>
  );
}
