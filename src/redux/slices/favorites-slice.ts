import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from '../../types/movie';

interface FavoritesState {
  items: number[];
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;

// Загружаем избранное из localStorage
const loadFromStorage = (): number[] => {
  const saved = localStorage.getItem('favorites');
  if (saved) {
    try {
      return JSON.parse(saved) as number[];
    } catch {
      return [];
    }
  }
  return [];
};

// Сохраняем в localStorage
const saveToStorage = (items: number[]): void => {
  localStorage.setItem('favorites', JSON.stringify(items));
};

// Загрузка фильмов по ID
export const fetchFavoriteMovies = createAsyncThunk(
  'favorites/fetchFavoriteMovies',
  async (ids: number[], { rejectWithValue }) => {
    try {
      const movies: Movie[] = [];
      
      // Загружаем фильмы по одному (API не поддерживает批量 запрос)
      for (const id of ids) {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`;
        const response = await fetch(url, {
          headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          movies.push(data);
        }
        
        // Небольшая задержка, чтобы не превысить лимит
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return movies;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось загрузить избранное';
      return rejectWithValue(message);
    }
  }
);

const initialState: FavoritesState = {
  items: loadFromStorage(),
  movies: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter(item => item !== id);
        // Удаляем фильм из movies, если он там есть
        state.movies = state.movies.filter(movie => movie.kinopoiskId !== id);
      } else {
        state.items.push(id);
      }
      saveToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      state.movies = [];
      saveToStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchFavoriteMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось загрузить избранное';
      });
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;