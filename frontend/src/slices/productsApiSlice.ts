import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import { UPLOAD_URL } from '../constants';
import { IProducts, IVariant } from '@/interfaces/Products';
import { ICategories } from '@/interfaces/Category';
interface IUpdateProduct {
  productId:string
  variantData:IVariant
  category:ICategories
}
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProducts,void>({
      query: () => ({
        url: PRODUCTS_URL,
      
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query<IProducts,string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation<IProducts,void>({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<IProducts,IUpdateProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation<void,IProducts>({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<IProducts,string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation<IProducts,IUpdateProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    addVariant: builder.mutation<IProducts,IUpdateProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/addVariants`,
        method: 'POST',
        body: data.variantData,
      }),
      invalidatesTags: ['Product'],
    }),
    searchProductsByCategory: builder.query<ICategories,IProducts>({
      query: ({ category }) => {
        const categoryUrlPart = category ? `category/${category}` : '';

        return {
          url: `${PRODUCTS_URL}/${categoryUrlPart}`,
         
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
