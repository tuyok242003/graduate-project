import { apiSlice } from '../slices/apiSlice';
import { CATEGORIES_URL } from '../../constants';
import { ICategories } from '@/interfaces/Category';
interface IUpdateCategoryInput {
  categoryId: string | undefined
  name:string
 
}
export const categorySlice = apiSlice.injectEndpoints({
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
    createCategory: builder.mutation<ICategories, string>({
      query: (categoryData) => ({
        url: `${CATEGORIES_URL}`,
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<void,IUpdateCategoryInput>({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});
export const {
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categorySlice;
