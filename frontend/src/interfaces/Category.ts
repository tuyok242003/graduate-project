import { IProducts } from "./Products";

export interface ICategories {
  _id: string;
  name: string;
  products: IProducts[];
  length:number
}
