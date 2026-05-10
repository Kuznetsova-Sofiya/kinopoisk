import React from 'react';
import type { Movie } from '../../data/mockMovies';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div style={styles.card}>
      <div style={styles.posterWrapper}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          style={styles.poster}
        />
        <span style={styles.rating}>{movie.rating}</span>
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>
        <p style={styles.meta}>{movie.year} • {movie.genre}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  posterWrapper: {
    position: 'relative' as const,
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  poster: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  rating: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    backgroundColor: '#00bb34',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
  },
  info: {
    padding: '0 4px',
  },
  title: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    margin: '0 0 6px 0',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    color: '#aaa',
    fontSize: '14px',
    margin: 0,
  },
};