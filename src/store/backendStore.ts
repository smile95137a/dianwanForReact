// src/store/backendStore.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/backend/authSlice';

const backendReducer = combineReducers({
  auth: authReducer,
});

export default backendReducer;
