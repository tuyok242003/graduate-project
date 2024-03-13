import { IProducts } from "./Products";

export interface ICategories {
  _id: string;
  categoryName: string;
  products: IProducts[];
  length:number
}
