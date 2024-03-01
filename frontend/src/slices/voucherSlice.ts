import { VOUCHERS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import { IVouchers } from '@/interfaces/Voucher';
export const voucherSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVouchers: builder.query<IVouchers[], void>({
      query: () => ({
        url: VOUCHERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getVoucherDetails: builder.query({
      query: (voucherId) => ({
        url: `${VOUCHERS_URL}/${voucherId}`,
      }),
      keepUnusedDataFor: 5,                              
    }),

    deleteVoucher: builder.mutation({
      query: (voucherId) => ({
        url: `${VOUCHERS_URL}/${voucherId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Voucher'],
    }),
    createVoucher: builder.mutation({
      query: (voucherData) => ({
        url: `${VOUCHERS_URL}`,
        method: 'POST',
        body: voucherData,
      }),
      invalidatesTags: ['Voucher'],
    }),
   
    updateVoucher: builder.mutation({
      query: (data) => ({
        url: `${VOUCHERS_URL}/${data.voucherId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Voucher'],
    }),
    
  }),
});

export const {
  useGetVouchersQuery,
  useGetVoucherDetailsQuery,
  useDeleteVoucherMutation,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
} = voucherSlice;
