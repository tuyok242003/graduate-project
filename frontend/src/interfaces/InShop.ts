import { OrderResponseBody } from '@paypal/paypal-js';
import { ICategories, IContact, IProducts, IVariant } from './OutShop';

export interface IUpdateCategoryInput {
  categoryId: string | undefined;
  name: string;
}
export interface IUpdateContact {
  contactId: string;
  data: IContact;
}
export interface IPayOrder {
  orderId: string | undefined;
  details?: OrderResponseBody;
}
export interface IUpdatePost {
  postId: string | undefined;
  image: string;
  postName: string;
  content: string;
}
export interface IUploadPost {
  postName: string;
  image: string;
  content: string;
}
export interface IImagePost {
  message: string;
  image: string;
}
export interface IUpdateProduct {
  productId?: string;
  productName: string;
  price: string;
  image: string;
  brand: string;
  category: string;
  description: string;
}
export interface IGetProduct {
  products: IProducts[];
}
export interface IAddVariant {
  variantData: IVariant;
  productId?: string;
}
export interface ICreateReview {
  productId?: string;
  rating: number;
  comment: string;
}
export interface ISreachCategory {
  category: ICategories | null;
}
export interface IUploadProduct {
  message: string;
  image: string;
}
export interface IUpdateUser {
  userId: string | undefined;
  userName: string;
  email: string;

  isAdmin: boolean;
}
export interface ILogin {
  email: string;
  password: string;
}
export interface IRegister {
  userName: string;
  email: string;
  password: string;
}
export interface IUpdateVoucher {
  voucherId: string | undefined;
  voucherName: string;
  discountAmount: string;
  qty: string;
  isUsed: boolean;
}
export interface IFormField {
  controlId: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface IButtonLink {
  to: string;
  text: string;
  className: string;
}
