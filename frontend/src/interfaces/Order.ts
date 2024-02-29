
export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
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
  cartItems: OrderItem[]
  order:Order[]
  voucherName:VoucherName
}
export interface VoucherName {
  name:string;
  isUsed:boolean;
  expiryDate:Date
}
export interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  images: string;
  price: number;
  productId: string;
  color: string;
  countInStock: number;
  variant:OrderItem

}

export interface ShippingAddress {
  address: string;
  city: string; 
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}
