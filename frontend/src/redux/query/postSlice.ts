import { POSTS_URL } from '../../constants';
import { apiSlice } from '../slices/apiSlice';
import { IPosts } from '@/interfaces/Post';
interface IUpdatePost {
  postId:string | undefined
  image:string
  postName:string
  content:string
}
interface IUploadPost {
  postName:string;
  image:string;
  content:string
}
interface IImagePost{
  message:string;
  image:string
}
export const postSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    deletePost: builder.mutation<IPosts,string>({
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
    createPost: builder.mutation<IPosts,IUploadPost >({
      query: (postData) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    uploadPostImage: builder.mutation<IImagePost,FormData>({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePost: builder.mutation<void,IUpdatePost>({
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
