import { POSTS_URL } from '../../constants';
import { apiSlice } from '../slices/apiSlice';
import { IPosts } from '@/interfaces/Post';
export const postSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IPosts[], void>({
      query: () => ({
        url: POSTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getPostDetails: builder.query({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    deletePost: builder.mutation({
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
    createPost: builder.mutation({
      query: (postData) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    uploadPostImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePost: builder.mutation({
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
