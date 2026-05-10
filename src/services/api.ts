import type { MoviesResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

export const fetchPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
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