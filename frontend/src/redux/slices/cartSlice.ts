import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../../utils/cartUtils';
import { IOrder } from '@/interfaces/Order';
interface ISelect{
  selected:IOrder
 
}
interface PayloadType {
  user: string;
  rating: number;
  numReviews: number;
  reviews: string;
  _id: string; // Thêm thuộc tính _id vào kiểu dữ liệu của payload
  // Thêm các thuộc tính khác nếu có
}
const cartFromLocalStorage = localStorage.getItem('cart') || '';

const initialState = cartFromLocalStorage
  ? JSON.parse(cartFromLocalStorage)
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal',voucherName:{} };

const cartSlice = createSlice({
  name: 'cart',                                                                                                 
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item }: PayloadType = action.payload;

      const existItem = state.cartItems.find((cart:IOrder) => cart._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((cart:IOrder) =>
          cart._id === existItem._id ? item : cart
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (cart: IOrder) => cart._id !== action.payload
      );
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveVoucherMethod:(state,action)=>{
      state.voucherName = action.payload;
      localStorage.setItem('cart',JSON.stringify(state))
    },
    clearCartItems: (state) => {
      const itemsToKeep = state.cartItems.filter((item:ISelect) => !item.selected);
      state.cartItems = itemsToKeep;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    increaseQty: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item:IOrder) => item._id === itemId);
      if (item) {
        if (item.qty < item.countInStock) { // Kiểm tra xem số lượng có nhỏ hơn số lượng trong kho không
          item.qty++; // Tăng số lượng sản phẩm
        }
      }
    },
    decreaseQty: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item:IOrder) => item._id === itemId);
      if (item) {
        if (item.qty > 1) { // Kiểm tra xem số lượng có lớn hơn 1 không
          item.qty--; // Giảm số lượng sản phẩm
        }
      }
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  saveVoucherMethod,
  clearCartItems,
  resetCart,
  increaseQty,
  decreaseQty
} = cartSlice.actions;

export default cartSlice.reducer;
