import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from './slices/catalog-slice';
import movieReducer from './slices/movie-slice';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    movie: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;