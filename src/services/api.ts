import type { Movie, PopularMoviesResponse, MovieDetails, SearchMoviesResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

const headers = {
  'X-API-KEY': API_KEY,
  'Content-Type': 'application/json',
};

// популярные фильмы (v2.2)
export const fetchPopularMovies = async (page: number = 1): Promise<PopularMoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/films/collections?type=TOP_POPULAR_MOVIES&page=${page}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Не удалось загрузить фильмы');
  }

  return response.json();
};

// по Id узнаем фильм
export const fetchMovieById = async (id: number): Promise<MovieDetails> => {
  const response = await fetch(`${BASE_URL}/films/${id}`, { headers });

  if (!response.ok) {
    throw new Error('Не удалось загрузить информацию о фильме');
  }

  return response.json();
};

// поиск (v2.1)
export const searchMovies = async (
  keyword: string,
  page: number = 1
): Promise<SearchMoviesResponse> => {
  if (keyword.length < 2) {
    throw new Error('Поисковый запрос слишком короткий');
  }

  const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=${page}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Не удалось выполнить поиск');
  }

  const data: SearchMoviesResponse = await response.json();

  // v2.1 возвращает filmId вместо kinopoiskId — нормализуем здесь
  const films: Movie[] = (data.films || []).map((film: Movie) => ({
    ...film,
    kinopoiskId: film.kinopoiskId || film.filmId || 0,
  }));

  return { ...data, films };
};