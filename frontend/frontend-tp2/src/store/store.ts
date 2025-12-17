import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import datasetReducer from './slices/datasetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    datasets: datasetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
