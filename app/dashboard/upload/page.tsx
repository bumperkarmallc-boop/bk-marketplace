import { redirect } from "next/navigation";

// This older upload page sent images to Cloudinary and never saved them to a
// product. Product creation with an image now lives on one page.
export default function OldUploadPage() {
  redirect("/creator/products/new");
}
