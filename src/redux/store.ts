import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from './slices/catalogSlice';
import movieReducer from './slices/movieSlice';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    movie: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;