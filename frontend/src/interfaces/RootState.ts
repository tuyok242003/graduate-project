import { IOrderItem, IShippingAddress, IVoucherName } from "./Order";

export interface RootState {
  cart: {
    cartItems: IOrderItem[];
    shippingAddress :IShippingAddress
    paymentMethod:string
    itemsPrice: number,
    shippingPrice: number,
    totalPrice:number
    voucherName:IVoucherName
    isUsed:IVoucherName
    voucherExpiryDate:string

  };}