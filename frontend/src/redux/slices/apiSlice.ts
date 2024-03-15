import { fetchBaseQuery, createApi, BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../constants"
import { logout } from "./authSlice"
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL
})

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
  const result = await baseQuery(args, api, extra)
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
  }
  return result
}
export const apiSlice = createApi({
  baseQuery: getBaseQueryWithAuth,
  tagTypes: ["Product", "Order", "User", "Contact", "Post", "Category", "Voucher"],
  endpoints: builder => ({})
})
