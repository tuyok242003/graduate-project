export interface ICategories {
  _id: string;
  name: string;
  products: IProducts[];
  length: number;
}

export interface IRootState {
  cart: {
    cartItems: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    voucherName: IVoucherName;
    isUsed: IVoucherName;
  };
}
export interface ICartItem {
  length: number;
  qty: number;
  reduce: number;
}
export interface IVoucherState {
  voucherName: string;
  discountAmount: string;
  qty: string;
  isUsed: boolean;
}
export interface IRegisterState {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface IProductState {
  productName: string;
  price: string;
  brand: string;
  category: string;
  description: string;
}
export interface IContact {
  _id?: string;
  contactName: string;
  email: string;
  phone: string;
  content: string;
  length?: number;
}
export interface IOutCategory {
  name: string;
}
export interface ICreateCategory {
  message: string;
  category?: ICategories;
}
export interface IOrder {
  _id: string;
  user: { name: string; _id: string };
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  isCancelled?: boolean;
  isConfirmed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  cartItems: IOrderItem[];
  order: IOrder;
  voucherName: IVoucherName;
  length: number;
  voucher: string;
  name: string;
  email: string;
}
export interface ICreateOrder {
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  voucherName: IVoucherName;
}
export interface IVoucherName {
  name: string;
  isUsed: boolean;
}
export interface IOrderItem {
  _id: string;
  name: string;
  qty: number;
  images: string;
  price: number;
  productId: string;
  color: string;
  countInStock: number;
  variant: IOrderItem;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}
export interface IPosts {
  _id: string;
  postName: string;
  image: string;
  content: string;
}
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
  id?: string;
  productId?: string;
  color: string;
  price: string;
  thumb: string;
  images: string;
  title: string;
  countInStock: number;
  quantitySold: number;
  discount: number;
}
export interface IAddProduct {
  productName: string;
  price: string;
  image: string;
  brand: string;
  category: string;
  description: string;
}
export interface IProducts {
  _id: string;
  productName: string;
  price: string;
  image: string;
  brand: string;
  category: ICategories;
  description: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  variants: IVariant[];
  createdAt?: Date;
  updatedAt?: Date;
  quantitySold: number;
  countInStock: number;
}
export interface IProductss {
  products: IProducts[];
}
export interface IUser {
  _id: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
export interface IVouchers {
  _id?: string;
  voucherName: string;
  discountAmount: string;

  isUsed: boolean;
  qty: string;

  length?: number;
}
export interface IDeleteVoucher {
  _id: string;
  voucherName: string;
  discountAmount: string;

  isUsed: boolean;
  qty: string;

  length?: number;
}
