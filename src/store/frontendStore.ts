import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/frontend/uiSlice';
import authReducer from './slices/frontend/authSlice';

const frontendReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
});

export default frontendReducer;
