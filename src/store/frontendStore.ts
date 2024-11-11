import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/frontend/uiSlice';

const frontendReducer = combineReducers({
  ui: uiReducer,
});

export default frontendReducer;
