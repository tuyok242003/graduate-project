import { PRODUCTS_URL } from '../../constants';
import { apiSlice } from '../slices/apiSlice';
import { UPLOAD_URL } from '../../constants';
import { IAddProduct, IProducts, IProductss, IVariant } from '@/interfaces/Products';
import { ICategories } from '@/interfaces/Category';
interface IUpdateProduct {
  productId?:string
name:string
image:string
brand:string
category:string
description:string
}
interface IGetProduct {
  products:IProducts[]
}
interface IAddVariant {
  variantData:IVariant
  productId?:string 
}
interface ICreateReview {
  productId?:string
  rating:number 
  comment:string
}
interface ISreachCategory {
  category:ICategories | null
}
interface IUploadProduct {
  message:string;
  image:string
}
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IGetProduct,void>({
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
    createProduct: builder.mutation<void,IAddProduct>({
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
    uploadProductImage: builder.mutation<IUploadProduct,FormData>({
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
    createReview: builder.mutation<IProducts,ICreateReview>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    addVariant: builder.mutation<IVariant,IAddVariant>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/addVariants`,
        method: 'POST',
        body: data.variantData,
      }),
      invalidatesTags: ['Product'],
    }),
    searchProductsByCategory: builder.query<IProducts[],ISreachCategory>({
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
