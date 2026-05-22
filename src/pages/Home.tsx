import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { loadMovies, clearMovies } from '../redux/slices/catalog-slice';
import type { AppDispatch, RootState } from '../redux/store';

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, currentPage, totalPages, loading, error } = useSelector(
    (state: RootState) => state.catalog
  );

  useEffect(() => {
    dispatch(loadMovies({ page: 1, reset: true }));
    
    return () => {
      dispatch(clearMovies());
    };
  }, [dispatch]);

  const handleShowMore = () => {
    if (currentPage < totalPages) {
      dispatch(loadMovies({ page: currentPage + 1, reset: false }));
    }
  };

  const hasMorePages = currentPage < totalPages;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Популярные фильмы</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <MovieGrid movies={movies} />
      
      {loading && (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '32px' }}>
          Загрузка
        </p>
      )}
      
      {!loading && hasMorePages && movies.length > 0 && (
        <div style={styles.buttonWrapper}>
          <button onClick={handleShowMore} style={styles.button}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  button: {
    backgroundColor: '#242426',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '40px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};