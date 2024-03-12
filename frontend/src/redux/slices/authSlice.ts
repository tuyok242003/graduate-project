import { createAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/interfaces/User';

interface AuthState {
  userInfo: IUser | null;
}
const initialState: AuthState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
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

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
