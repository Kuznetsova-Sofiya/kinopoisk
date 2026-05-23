import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from '../../types/movie';

interface TrendsState {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: TrendsState = {
  movies: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;

// функция задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loadTrends = createAsyncThunk(
  'trends/loadTrends',
  async ({ page }: { page: number }, { rejectWithValue }) => {
    try {
      // только для страниц > 1
      if (page > 1) {
        await delay(800);
      }
      
      const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=${page}`;
      
      const response = await fetch(url, {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 429) {
        return rejectWithValue('Слишком много запросов. Попробуйте позже.');
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return { 
        movies: data.items || [], 
        totalPages: data.totalPages || 1, 
        page 
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить тренды';
      return rejectWithValue(message);
    }
  }
);

const trendsSlice = createSlice({
  name: 'trends',
  initialState,
  reducers: {
    clearTrends: (state) => {
      state.movies = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTrends.fulfilled, (state, action: PayloadAction<{ movies: Movie[]; totalPages: number; page: number }>) => {
        state.loading = false;
        state.totalPages = action.payload.totalPages;
        
        // пагинация
        if (action.payload.page === 1) {
          state.movies = action.payload.movies;
        } else {
          //обработка дублирования
          const existingIds = new Set(state.movies.map(m => m.kinopoiskId));
          const newMovies = action.payload.movies.filter(m => !existingIds.has(m.kinopoiskId));
          state.movies = [...state.movies, ...newMovies];
        }
        state.currentPage = action.payload.page;
      })
      .addCase(loadTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось загрузить тренды';
      });
  },
});

export const { clearTrends } = trendsSlice.actions;
export default trendsSlice.reducer;