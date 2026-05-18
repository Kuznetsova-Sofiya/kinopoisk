import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchPopularMovies } from '../../services/api';
import type { Movie } from '../../types/movie';

interface CatalogState {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  movies: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

//асинхронный thunk загрузки фильмов
export const loadMovies = createAsyncThunk(
  'catalog/loadMovies',
  async ({ page, reset }: { page: number; reset?: boolean }) => {
    const data = await fetchPopularMovies(page);
    return { movies: data.items, totalPages: data.totalPages, reset };
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMovies.fulfilled, (state, action: PayloadAction<{ movies: Movie[]; totalPages: number; reset?: boolean }>) => {
        state.loading = false;
        state.totalPages = action.payload.totalPages;
        
        if (action.payload.reset) {
          state.movies = action.payload.movies;
          state.currentPage = 1;
        } else {
          state.movies = [...state.movies, ...action.payload.movies];
          state.currentPage += 1;
        }
      })
      .addCase(loadMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить фильмы';
      });
  },
});

export const { clearMovies } = catalogSlice.actions;
export default catalogSlice.reducer;