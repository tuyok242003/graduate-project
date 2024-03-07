
export interface IOrder {
  _id: string;
  user: string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  isCancelled?: boolean;
  isConfirmed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  cartItems: IOrderItem[]
  order:IOrder[]
  voucherName:IVoucherName
  
}
export interface IVoucherName {
  name:string;
  isUsed:boolean;
  expiryDate:Date
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
  variant:IOrderItem

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
