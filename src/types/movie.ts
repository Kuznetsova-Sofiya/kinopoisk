export interface Movie {
  kinopoiskId: number;
  nameRu: string | null;
  nameEn: string | null;
  posterUrl: string;
  posterUrlPreview: string;
  ratingKinopoisk: number | null;
  year: number | null;
  genres: { genre: string }[];
}

export interface MoviesResponse {
  total: number;
  totalPages: number;
  items: Movie[];
}