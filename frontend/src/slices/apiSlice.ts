import { fetchBaseQuery, createApi,BaseQueryApi, FetchArgs  } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice'; // Import the logout action

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function getBaseQueryWithAuth(args: FetchArgs, api: BaseQueryApi, extra: object) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: getBaseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User', 'Contact', 'Post', 'Category','Voucher'],
  endpoints: (builder) => ({}),
});
