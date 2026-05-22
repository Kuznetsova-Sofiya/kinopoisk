import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../types/movie';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const keyword = searchParams.get('q') || '';

  useEffect(() => {
    if (!keyword) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
        const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=1`;
        
        const response = await fetch(url, {
          headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data.films || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  if (loading) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>
          Поиск: "{keyword}"
        </h1>
        <p style={{ color: '#aaa' }}>Загрузка</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>
          Результат поиска: "{keyword}"
        </h1>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <p style={{ color: '#aaa' }}>Пожалуйста, попробуйте позже</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>
        Результаты поиска: "{keyword}"
      </h1>
      
      {movies.length === 0 ? (
        <p style={{ color: '#aaa' }}>Ничего не найдено</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};