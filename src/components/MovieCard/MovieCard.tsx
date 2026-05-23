import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { Movie } from '../../types/movie';
import type { RootState } from '../../redux/store';
import { toggleFavorite } from '../../redux/slices/favorites-slice';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.includes(movie.kinopoiskId);
  
  const title = movie.nameRu || movie.nameEn || 'Без названия';
  const year = movie.year || '';
  const genre = movie.genres?.[0]?.genre || '';
  const rating = movie.ratingKinopoisk?.toFixed(1) || '';
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(movie.kinopoiskId));
  };

  return (
    <Link to={`/movie/${movie.kinopoiskId}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        <img src={movie.posterUrlPreview} alt={title} className={styles.poster} />
        {rating && <span className={styles.rating}>{rating}</span>}
        <button 
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
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