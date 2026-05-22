import type { PopularMoviesResponse, MovieDetails, SearchMoviesResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

// популярные фильмы (v2.2)
export const fetchPopularMovies = async (page: number = 1): Promise<PopularMoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/films/collections?type=TOP_POPULAR_MOVIES&page=${page}`,
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  
  return response.json();
};

//по Id узнаем фильм
export const fetchMovieById = async (id: number): Promise<MovieDetails> => {
  const response = await fetch(
    `${BASE_URL}/films/${id}`,
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  
  return response.json();
};

// поиск (v2.1)
export const searchMovies = async (
  keyword: string,
  page: number = 1
): Promise<SearchMoviesResponse> => {
  if (keyword.length < 2) {
    throw new Error('Search query must be longer than 1 character');
  }
  
  const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=${page}`;
  
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  
  return response.json();
};