import { ICategories } from "./Category";

export interface IReview {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string; // Assuming user is identified by a string ID
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVariant {
  id: string;
  productId: string;
  color: string;
  price: number;
  thumb: string;
  images: string;
  title: string;
  countInStock: number;
  quantitySold: number;
  discount:number
}

export interface IProducts {
  _id: string;
  productName: string;
  price:string;
  image: string;
  brand: string;
  category: ICategories | string;
  description: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  variants: IVariant[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IProductss {
  products: IProducts[];
}
