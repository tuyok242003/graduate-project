import { POSTS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import { IPosts } from '@/interfaces/Post';
interface IUpdatePost {
  postId:string
}
export const postSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IPosts, void>({
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
    createPost: builder.mutation<IPosts, void>({
      query: (postData) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    uploadPostImage: builder.mutation<IPosts,void>({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePost: builder.mutation<IPosts,IUpdatePost>({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostDetailsQuery,
  useDeletePostMutation,
  // useGetTopPostsQuery,
  useCreatePostMutation,
  useUploadPostImageMutation,
  useUpdatePostMutation,
} = postSlice;
