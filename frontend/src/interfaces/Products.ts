import { Categories } from "./Category";

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string; // Assuming user is identified by a string ID
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Variant {
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

export interface Products {
  _id: string;
  name: string;
  price:string;
  image: string;
  brand: string;
  category: Categories | string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  variants: Variant[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Productss {
  products: Products[];
}
