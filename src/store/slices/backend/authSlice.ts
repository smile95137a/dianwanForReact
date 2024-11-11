// src/store/slices/backend/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  user: any | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ accessToken: string; user: any }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearAuthData: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
