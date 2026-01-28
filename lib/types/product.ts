export type ProductImage = {
  id: string
  url: string
  alt?: string
}

export type Product = {
  id: string
  creatorId: string

  title: string
  description: string

  price: number
  currency: 'USD'

  images: ProductImage[]   // supports multi-image from day one

  status: 'draft' | 'active' | 'archived'

  createdAt: Date
  updatedAt: Date
}
