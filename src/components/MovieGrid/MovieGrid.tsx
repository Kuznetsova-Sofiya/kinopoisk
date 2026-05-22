import type { Movie } from '../../types/movie';
import { MovieCard } from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.scss';

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid = ({ movies }: MovieGridProps) => {
  return (
    <div className={styles.grid}>
      {movies.map((movie, index) => (
        <MovieCard 
          key={movie.kinopoiskId || `movie-${index}-${movie.nameRu || index}`} 
          movie={movie} 
        />
      ))}
    </div>
  );
};