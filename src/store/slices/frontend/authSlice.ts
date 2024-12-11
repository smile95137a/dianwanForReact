import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState, removeState } from '@/utils/Localstorage';

interface AuthState {
  user: any | null;
  token: string | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: loadState<any>('fuser') || null,
  token: loadState<string>('ftoken') || null,
  isLogin: !!loadState<string>('ftoken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      saveState('fuser', action.payload);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isLogin = !!action.payload;
      saveState('ftoken', action.payload);
    },
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.isLogin = false;
      removeState('fuser');
      removeState('ftoken');
    },
  },
});

export const { setUser, setToken, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
