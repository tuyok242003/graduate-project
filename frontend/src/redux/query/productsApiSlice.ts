import { PRODUCTS_URL } from '../../constants';
import { apiSlice } from '../slices/apiSlice';
import { UPLOAD_URL } from '../../constants';
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    addVariant: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/addVariants`,
        method: 'POST',
        body: data.variantData,
      }),
      invalidatesTags: ['Product'],
    }),
    searchProductsByCategory: builder.query({
      query: ({ category, keyword, pageNumber }) => {
        const categoryUrlPart = category ? `category/${category}` : '';

        return {
          url: `${PRODUCTS_URL}/${categoryUrlPart}`,
          params: { keyword, pageNumber },
        };
      },
      providesTags: (result, error, { category }) =>
        result ? [{ type: 'Product', category }] : [],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useAddVariantMutation,
  useSearchProductsByCategoryQuery,
} = productsApiSlice;
