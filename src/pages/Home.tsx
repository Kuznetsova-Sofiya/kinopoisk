import React, { useState, useEffect } from 'react';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { fetchPopularMovies } from '../services/api';
import type { Movie } from '../types/movie';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularMovies(1);
        setMovies(data.items);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить фильмы');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Популярные фильмы</h1>
        <p style={{ color: '#aaa' }}>Загрузка фильмов</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Популярные фильмы</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Популярные фильмы</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};