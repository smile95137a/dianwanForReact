import { configureStore, combineReducers } from '@reduxjs/toolkit';
import backendReducer from './backendStore';
import frontendReducer from './frontendStore';

const rootReducer = combineReducers({
  backend: backendReducer,
  frontend: frontendReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
