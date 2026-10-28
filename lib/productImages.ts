// Product image rules — must match the Supabase "product-images" bucket
// settings (5 MB, PNG/JPG/WEBP/GIF) and storage rules (each user uploads only
// into a folder named with their own user ID: <user id>/<file>).
export const PRODUCT_IMAGE_BUCKET = "product-images"
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
}

// Returns an error message, or null if the file is acceptable.
export function checkProductImage(file: File): string | null {
  if (!(file.type in ALLOWED_IMAGE_TYPES)) {
    return "Only PNG, JPG, WEBP or GIF images are allowed."
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller."
  }
  return null
}

// Storage path for a new image: "<user id>/<random id>.<ext>".
// The first folder MUST be the uploader's user ID, or Supabase refuses it.
export function productImagePath(userId: string, file: File): string {
  const ext = ALLOWED_IMAGE_TYPES[file.type] ?? "img"
  return `${userId}/${crypto.randomUUID()}.${ext}`
}
