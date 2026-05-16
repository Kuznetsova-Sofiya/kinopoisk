import React from 'react';
import type { Movie } from '../../types/movie';
import { MovieCard } from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.kinopoiskId} movie={movie} />
      ))}
    </div>
  );
};