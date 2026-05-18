import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchMovieById } from '../../services/api';
import type { MovieDetails } from '../../types/movie';

interface MovieState {
  movie: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movie: null,
  loading: false,
  error: null,
};

//асинхронный thunk загрузки информации о фильме
export const loadMovieById = createAsyncThunk(
  'movie/loadMovieById',
  async (id: number) => {
    const data = await fetchMovieById(id);
    return data;
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    clearMovie: (state) => {
      state.movie = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMovieById.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(loadMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить информацию о фильме';
      });
  },
});

export const { clearMovie } = movieSlice.actions;
export default movieSlice.reducer;