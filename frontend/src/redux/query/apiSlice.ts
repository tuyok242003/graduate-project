import { fetchBaseQuery, createApi, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import {
  BASE_URL,
  CATEGORIES_URL,
  CONTACTS_URL,
  ORDERS_URL,
  PAYPAL_URL,
  POSTS_URL,
  PRODUCTS_URL,
  UPLOAD_URL,
  USERS_URL,
  VOUCHERS_URL,
} from '../../constants/constants';
import { logout } from '../slices/authSlice';
import {
  IAddProduct,
  ICategories,
  IContact,
  ICreateOrder,
  IDeleteVoucher,
  IOrder,
  IPosts,
  IProducts,
  IUser,
  IVariant,
  IVouchers,
} from '@/interfaces/OutShop';
import {
  IAddVariant,
  ICreateReview,
  IGetProduct,
  IImagePost,
  IPayOrder,
  ISreachCategory,
  IUpdateCategoryInput,
  IUpdateContact,
  IUpdatePost,
  IUpdateProduct,
  IUpdateUser,
  IUpdateVoucher,
  IUploadPost,
  IUploadProduct,
} from '@/interfaces/InShop';
import { ILogin, IRegister } from '@/interfaces/InShop';
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

// async function getBaseQueryWithAuth(args: FetchArgs, api: BaseQueryApi, extra: object) {
//   const result = await baseQuery(args, api, extra);
//   if (result.error && result.error.status === 401) {
//     const refreshTokenResult = await refreshToken(); // Gọi hàm refresh token
//     if (refreshTokenResult.error && refreshTokenResult.error.status === 401) {
//       api.dispatch(logout()); // Đăng xuất nếu cả token và refresh token đều hết hạn
//     }
//   }
//   return result;
// }

async function getBaseQueryWithAuth(args: FetchArgs, api: BaseQueryApi, extra: object) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}
export const apiSlice = createApi({
  baseQuery: getBaseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User', 'Contact', 'Post', 'Category', 'Voucher'],
  endpoints: (builder) => ({
    getCategories: builder.query<ICategories[], void>({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getCategoryDetails: builder.query<ICategories, string>({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    deleteCategory: builder.mutation<ICategories, string>({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    createCategory: builder.mutation<{ message: string; category?: ICategories }, { name: string }>({
      query: (input) => ({
        url: `${CATEGORIES_URL}`,
        method: 'POST',
        body: input,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<void, IUpdateCategoryInput>({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    getContacts: builder.query<IContact, void>({
      query: () => ({
        url: CONTACTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getContactDetails: builder.query<IContact, string>({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addContact: builder.mutation<IUpdateContact, IContact>({
      query: (newContact) => ({
        url: `${CONTACTS_URL}`,
        method: 'POST',
        body: newContact,
      }),
      // Keep the data for a short time to update the list of products
      // or you can adjust this based on your requirements
      invalidatesTags: ['Contact'],
    }),

    deleteContact: builder.mutation<IContact, string>({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation<IContact, IUpdateContact>({
      query: (data) => ({
        url: `${CONTACTS_URL}/${data.contactId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
    createOrder: builder.mutation<IOrder, ICreateOrder>({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query<IOrder, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation<void, IPayOrder>({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query<IOrder, void>({
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
    deliverOrder: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    deleteOrder: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    confirmOrder: builder.mutation<IOrder, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    updateQuantitySoldLocally: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/updateQuantitySoldLocally/${orderId}`,
        method: 'PUT',
      }),
    }),
    confirmPayment: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/confirmPayment`,
        method: 'PUT',
      }),
    }),
    getPosts: builder.query<IPosts[], void>({
      query: () => ({
        url: POSTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getPostDetails: builder.query<IPosts, string>({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    deletePost: builder.mutation<IPosts, string>({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    // getTopPosts: builder.query({
    //   query: () => `${POSTS_URL}/top`,
    //   keepUnusedDataFor: 5,
    // }),
    createPost: builder.mutation<IPosts, IUploadPost>({
      query: (postData) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    uploadPostImage: builder.mutation<IImagePost, FormData>({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePost: builder.mutation<void, IUpdatePost>({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),
    getProducts: builder.query<IGetProduct, void>({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query<IProducts, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation<void, IAddProduct>({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<IProducts, IUpdateProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation<IUploadProduct, FormData>({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<IProducts, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation<IProducts, ICreateReview>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    addVariant: builder.mutation<IVariant, IAddVariant>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/addVariants`,
        method: 'POST',
        body: data.variantData,
      }),
      invalidatesTags: ['Product'],
    }),
    searchProductsByCategory: builder.query<IProducts[], ISreachCategory>({
      query: ({ category }) => {
        const categoryUrlPart = category ? `category/${category}` : '';

        return {
          url: `${PRODUCTS_URL}/${categoryUrlPart}`,
        };
      },
      providesTags: (result, error, { category }) => (result ? [{ type: 'Product', category }] : []),
      keepUnusedDataFor: 5,
    }),
    login: builder.mutation<IUser, ILogin>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<IUpdateUser, IRegister>({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<IUser, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query<IUser, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation<void, IUpdateUser>({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getVouchers: builder.query<IVouchers[], void>({
      query: () => ({
        url: VOUCHERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getVoucherDetails: builder.query<IVouchers, string>({
      query: (voucherId) => ({
        url: `${VOUCHERS_URL}/${voucherId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    deleteVoucher: builder.mutation<IDeleteVoucher, string>({
      query: (voucherId) => ({
        url: `${VOUCHERS_URL}/${voucherId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Voucher'],
    }),
    createVoucher: builder.mutation<void, IVouchers>({
      query: (voucherData) => ({
        url: `${VOUCHERS_URL}`,
        method: 'POST',
        body: voucherData,
      }),
      invalidatesTags: ['Voucher'],
    }),

    updateVoucher: builder.mutation<IVouchers, IUpdateVoucher>({
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
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetVouchersQuery,
  useGetVoucherDetailsQuery,
  useDeleteVoucherMutation,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useAddVariantMutation,
  useSearchProductsByCategoryQuery,
  useGetPostsQuery,
  useGetPostDetailsQuery,
  useDeletePostMutation,
  // useGetTopPostsQuery,
  useCreatePostMutation,
  useUploadPostImageMutation,
  useUpdatePostMutation,
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
  useGetContactsQuery,
  useGetContactDetailsQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = apiSlice;
