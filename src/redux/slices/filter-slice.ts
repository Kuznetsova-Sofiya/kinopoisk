import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchGenres, fetchFilteredMovies } from '../../services/api';
import type { Movie, Genre } from '../../types/movie';

interface FilterState {
  genres: Genre[];
  genresLoading: boolean;

  selectedGenre: number | null;
  yearFrom: string;
  yearTo: string;

  movies: Movie[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  isFilterActive: boolean;
}

const initialState: FilterState = {
  genres: [],
  genresLoading: false,

  selectedGenre: null,
  yearFrom: '',
  yearTo: '',

  movies: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  isFilterActive: false,
};

export const loadGenres = createAsyncThunk(
  'filter/loadGenres',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchGenres();
      return data.genres;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить жанры';
      return rejectWithValue(message);
    }
  }
);

export const applyFilters = createAsyncThunk(
  'filter/applyFilters',
  async (
    params: { genreId: number | null; yearFrom: string; yearTo: string; page: number; reset: boolean },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchFilteredMovies({
        genreId: params.genreId ?? undefined,
        yearFrom: params.yearFrom ? Number(params.yearFrom) : undefined,
        yearTo: params.yearTo ? Number(params.yearTo) : undefined,
        order: 'RATING',
        page: params.page,
      });
      return {
        movies: data.items,
        totalPages: data.totalPages,
        page: params.page,
        reset: params.reset,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить фильмы';
      return rejectWithValue(message);
    }
  }
);

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setGenre: (state, action: PayloadAction<number | null>) => {
      state.selectedGenre = action.payload;
    },
    setYearFrom: (state, action: PayloadAction<string>) => {
      state.yearFrom = action.payload;
    },
    setYearTo: (state, action: PayloadAction<string>) => {
      state.yearTo = action.payload;
    },
    resetFilters: (state) => {
      state.selectedGenre = null;
      state.yearFrom = '';
      state.yearTo = '';
      state.movies = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.isFilterActive = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGenres.pending, (state) => {
        state.genresLoading = true;
      })
      .addCase(loadGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.genresLoading = false;
        state.genres = action.payload;
      })
      .addCase(loadGenres.rejected, (state) => {
        state.genresLoading = false;
      })

      .addCase(applyFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        applyFilters.fulfilled,
        (state, action: PayloadAction<{ movies: Movie[]; totalPages: number; page: number; reset: boolean }>) => {
          state.loading = false;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.page;
          state.isFilterActive = true;

          if (action.payload.reset) {
            state.movies = action.payload.movies;
          } else {
            const existingIds = new Set(state.movies.map((m) => m.kinopoiskId));
            const newMovies = action.payload.movies.filter((m) => !existingIds.has(m.kinopoiskId));
            state.movies = [...state.movies, ...newMovies];
          }
        }
      )
      .addCase(applyFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось загрузить фильмы';
      });
  },
});

export const { setGenre, setYearFrom, setYearTo, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
