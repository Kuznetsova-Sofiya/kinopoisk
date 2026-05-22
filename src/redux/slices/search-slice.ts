import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { searchMovies } from '../../services/api';
import type { Movie } from '../../types/movie';

interface SearchState {
  allMovies: Movie[];
  filteredMovies: Movie[];
  query: string;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedGenres: string[];
  yearFrom: string;
  yearTo: string;
  ratingFrom: string;
  ratingTo: string;
}

const initialState: SearchState = {
  allMovies: [],
  filteredMovies: [],
  query: '',
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  selectedGenres: [],
  yearFrom: '',
  yearTo: '',
  ratingFrom: '',
  ratingTo: '',
};

//фильтрация
const applyFilters = (
  movies: Movie[],
  selectedGenres: string[],
  yearFrom: string,
  yearTo: string,
  ratingFrom: string,
  ratingTo: string
): Movie[] => {
  let filtered = [...movies];
  
  if (selectedGenres.length > 0) {
    filtered = filtered.filter(movie =>
      movie.genres?.some(g => 
        selectedGenres.some(selected => 
          g.genre.toLowerCase() === selected.toLowerCase()
        )
      )
    );
  }
  
  if (yearFrom) {
    filtered = filtered.filter(movie => (movie.year || 0) >= Number(yearFrom));
  }
  if (yearTo) {
    filtered = filtered.filter(movie => (movie.year || 0) <= Number(yearTo));
  }
  
  if (ratingFrom) {
    filtered = filtered.filter(movie => (movie.ratingKinopoisk || 0) >= Number(ratingFrom));
  }
  if (ratingTo) {
    filtered = filtered.filter(movie => (movie.ratingKinopoisk || 0) <= Number(ratingTo));
  }
  
  return filtered;
};

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, page }: { query: string; page: number }) => {
    const data = await searchMovies(query, page);
    return { movies: data.films, totalPages: data.pagesCount, page, query };
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSelectedGenres: (state, action: PayloadAction<string[]>) => {
      state.selectedGenres = action.payload;
      state.filteredMovies = applyFilters(
        state.allMovies,
        state.selectedGenres,
        state.yearFrom,
        state.yearTo,
        state.ratingFrom,
        state.ratingTo
      );
    },
    setYearFrom: (state, action: PayloadAction<string>) => {
      state.yearFrom = action.payload;
      state.filteredMovies = applyFilters(
        state.allMovies,
        state.selectedGenres,
        state.yearFrom,
        state.yearTo,
        state.ratingFrom,
        state.ratingTo
      );
    },
    setYearTo: (state, action: PayloadAction<string>) => {
      state.yearTo = action.payload;
      state.filteredMovies = applyFilters(
        state.allMovies,
        state.selectedGenres,
        state.yearFrom,
        state.yearTo,
        state.ratingFrom,
        state.ratingTo
      );
    },
    setRatingFrom: (state, action: PayloadAction<string>) => {
      state.ratingFrom = action.payload;
      state.filteredMovies = applyFilters(
        state.allMovies,
        state.selectedGenres,
        state.yearFrom,
        state.yearTo,
        state.ratingFrom,
        state.ratingTo
      );
    },
    setRatingTo: (state, action: PayloadAction<string>) => {
      state.ratingTo = action.payload;
      state.filteredMovies = applyFilters(
        state.allMovies,
        state.selectedGenres,
        state.yearFrom,
        state.yearTo,
        state.ratingFrom,
        state.ratingTo
      );
    },
    clearFilters: (state) => {
      state.selectedGenres = [];
      state.yearFrom = '';
      state.yearTo = '';
      state.ratingFrom = '';
      state.ratingTo = '';
      state.filteredMovies = applyFilters(state.allMovies, [], '', '', '', '');
    },
    clearSearch: (state) => {
      state.allMovies = [];
      state.filteredMovies = [];
      state.query = '';
      state.currentPage = 1;
      state.totalPages = 0;
      state.selectedGenres = [];
      state.yearFrom = '';
      state.yearTo = '';
      state.ratingFrom = '';
      state.ratingTo = '';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.page === 1) {
          state.allMovies = action.payload.movies;
        } else {
          state.allMovies = [...state.allMovies, ...action.payload.movies];
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        
        state.filteredMovies = applyFilters(
          state.allMovies,
          state.selectedGenres,
          state.yearFrom,
          state.yearTo,
          state.ratingFrom,
          state.ratingTo
        );
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const selectSearchState = (state: { search: SearchState }) => state.search;

export const selectFilteredMovies = createSelector(
  [selectSearchState],
  (searchState) => searchState.filteredMovies
);

export const selectSearchLoading = createSelector(
  [selectSearchState],
  (searchState) => searchState.loading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (searchState) => searchState.error
);

export const {
  setQuery,
  setSelectedGenres,
  setYearFrom,
  setYearTo,
  setRatingFrom,
  setRatingTo,
  clearFilters,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;