import React from 'react';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { mockMovies } from '../data/mockMovies';

export const Home: React.FC = () => {
  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Фильмы</h1>
      <MovieGrid movies={mockMovies} />
    </div>
  );
};