import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from './slices/catalog-slice';
import movieReducer from './slices/movie-slice';
import searchReducer from './slices/search-slice';
import trendsReducer from './slices/trends-slice';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    movie: movieReducer,
    search: searchReducer,
    trends: trendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;