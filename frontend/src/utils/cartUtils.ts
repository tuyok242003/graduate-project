import { Order, OrderItem } from '@/interfaces/Order';
export const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};
export const updateCart = (state:Order , item?: Order) => {
  const itemsPrice = state.cartItems.reduce(
    (acc: number, item: OrderItem) => acc + (item.price * 100 * item.qty) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  const totalPrice =  shippingPrice 

  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
