import { createSlice, createSelector } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/OutShop';

interface AuthState {
  userInfo: IUser | null;
}
const initialState: AuthState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
};
const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});
const selectAuth = (state: { auth?: AuthState }) => state.auth;

export const selectUserInfo = createSelector(selectAuth, (auth) => auth?.userInfo);
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
