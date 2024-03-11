import { apiSlice } from '../slices/apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../../constants';
import { IOrder } from '@/interfaces/Order';
interface PayOrderInput {
  orderId: string;
  details: IOrder;
 
}
export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<void,IOrder>({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query<IOrder[], string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation<void,PayOrderInput>({
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
    deliverOrder: builder.mutation<IOrder,string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    deleteOrder: builder.mutation<IOrder,string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation<IOrder,string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    confirmOrder: builder.mutation<IOrder,string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    updateQuantitySoldLocally: builder.mutation<IOrder,string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/updateQuantitySoldLocally/${orderId}`,
        method: 'PUT',
      }),
    }),
    confirmPayment: builder.mutation<IOrder,string>({
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
