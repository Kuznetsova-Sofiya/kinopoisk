import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const title = movie.nameRu || movie.nameEn || 'Без названия';
  const year = movie.year || '';
  const genre = movie.genres?.[0]?.genre || '';
  const rating = movie.ratingKinopoisk?.toFixed(1) || '';

  return (
    <Link to={`/movie/${movie.kinopoiskId}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        <img src={movie.posterUrlPreview} alt={title} className={styles.poster} />
        {rating && <span className={styles.rating}>{rating}</span>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>
          {year} {genre ? `• ${genre}` : ''}
        </p>
      </div>
    </Link>
  );
};