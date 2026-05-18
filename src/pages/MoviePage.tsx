import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadMovieById, clearMovie } from '../redux/slices/movieSlice';
import type { AppDispatch, RootState } from '../redux/store';

export const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { movie, loading, error } = useSelector((state: RootState) => state.movie);

  useEffect(() => {
    if (id) {
      dispatch(loadMovieById(Number(id)));
    }
    
    return () => {
      dispatch(clearMovie());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div>
        <p style={{ color: '#aaa' }}>Загрузка</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error || 'Фильм не найден'}</p>
      </div>
    );
  }

  const title = movie.nameRu || movie.nameEn || 'Без названия';
  const genres = movie.genres?.map(g => g.genre).join(' • ') || '';
  const countries = movie.countries?.map(c => c.country).join(', ') || '';
  const rating = movie.ratingKinopoisk?.toFixed(1) || 'Нет';
  const year = movie.year || 'Нет';
  const length = movie.filmLength ? `${movie.filmLength} мин` : 'Нет';
  const description = movie.description || movie.shortDescription || 'Описание отсутствует';

  return (
    <div style={styles.container}>
      <div style={styles.movieContainer}>
        <div style={styles.posterColumn}>
          <img 
            src={movie.posterUrl} 
            alt={title} 
            style={styles.poster}
          />
        </div>

        <div style={styles.infoColumn}>
          <h1 style={styles.title}>{title}</h1>
          {movie.nameOriginal && (
            <p style={styles.originalTitle}>{movie.nameOriginal}</p>
          )}
          
          <div style={styles.badges}>
            {movie.ratingKinopoisk && (
              <span style={styles.ratingBadge}>{rating}</span>
            )}
            {movie.filmLength && (
              <span style={styles.lengthBadge}>{length}</span>
            )}
          </div>

          <p style={styles.description}>{description}</p>

          <div style={styles.details}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Год:</span>
              <span style={styles.detailValue}>{year}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Страна:</span>
              <span style={styles.detailValue}>{countries || 'Нет'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Жанр:</span>
              <span style={styles.detailValue}>{genres || 'Нет'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  movieContainer: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap' as const,
  },
  posterColumn: {
    flex: '0 0 300px',
  },
  poster: {
    width: '100%',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  infoColumn: {
    flex: '1',
    minWidth: '280px',
  },
  title: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold' as const,
    margin: '0 0 8px 0',
  },
  originalTitle: {
    color: '#aaa',
    fontSize: '18px',
    margin: '0 0 20px 0',
  },
  badges: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  ratingBadge: {
    backgroundColor: '#00bb34',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  lengthBadge: {
    backgroundColor: '#242426',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  description: {
    color: '#ccc',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  details: {
    borderTop: '1px solid #333',
    paddingTop: '20px',
  },
  detailRow: {
    display: 'flex',
    marginBottom: '12px',
  },
  detailLabel: {
    color: '#aaa',
    width: '100px',
    fontSize: '14px',
  },
  detailValue: {
    color: 'white',
    fontSize: '14px',
    flex: '1',
  },
};