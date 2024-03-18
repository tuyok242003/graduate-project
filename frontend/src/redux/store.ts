import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../redux/query/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
