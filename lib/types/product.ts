export type ProductStatus = "draft" | "active" | "archived";

export type Product = {
  id: string;
  creatorId: string;

  title: string;
  description: string;

  price: number;

  images: string[]; // supports multiple images now & later

  status: ProductStatus;

  createdAt: Date;
  updatedAt: Date;
};
