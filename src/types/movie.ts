export interface Movie {
  kinopoiskId: number;
  filmId?: number;
  nameRu: string | null;
  nameEn: string | null;
  posterUrl: string;
  posterUrlPreview: string;
  ratingKinopoisk: number | null;
  year: number | null;
  genres: { genre: string }[];
}

export interface MovieDetails {
  kinopoiskId: number;
  nameRu: string | null;
  nameEn: string | null;
  nameOriginal: string | null;
  posterUrl: string;
  posterUrlPreview: string;
  description: string | null;
  shortDescription: string | null;
  ratingKinopoisk: number | null;
  ratingImdb: number | null;
  year: number | null;
  filmLength: number | null;
  slogan: string | null;
  genres: { genre: string }[];
  countries: { country: string }[];
}

// Формат ответа для v2.2 (популярные фильмы, коллекции)
export interface PopularMoviesResponse {
  total: number;
  totalPages: number;
  items: Movie[];
}

// Формат ответа для v2.1 (поиск)
export interface SearchMoviesResponse {
  keyword: string;
  pagesCount: number;
  searchFilmsCountResult: number;
  films: Movie[];
}