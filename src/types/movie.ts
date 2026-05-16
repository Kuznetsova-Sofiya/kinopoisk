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

export interface MoviesResponse {
  total: number;
  totalPages: number;
  items: Movie[];
}