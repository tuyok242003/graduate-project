import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';
import { IOrder } from '@/interfaces/Order';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query<IOrder[], void>({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    confirmOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    updateQuantitySoldLocally: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/updateQuantitySoldLocally/${orderId}`,
        method: 'PUT',
      }),
    }),
    confirmPayment: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/confirmPayment`,
        method: 'PUT',
      }),
    }),
    // getCancelledOrders: builder.query({
    //   query: () => ({
    //     url: `${ORDERS_URL}/cancelled`, // Endpoint backend để lấy danh sách đơn hàng đã bị huỷ
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
   
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useConfirmOrderMutation,
} = orderApiSlice;
