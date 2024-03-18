import { IOrder, IOrderItem } from '../interfaces/OutShop';
export const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};
export const updateCart = (state: IOrder, item?: IOrder) => {
  const itemsPrice = state.cartItems.reduce((acc: number, item: IOrderItem) => acc + (item.price * 100 * item.qty) / 100, 0);
  state.itemsPrice = addDecimals(itemsPrice);

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  const totalPrice = shippingPrice;

  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
