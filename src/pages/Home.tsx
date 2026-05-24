import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import { loadMovies, clearMovies } from '../redux/slices/catalog-slice';
import { applyFilters } from '../redux/slices/filter-slice';
import type { AppDispatch, RootState } from '../redux/store';

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const catalog = useSelector((state: RootState) => state.catalog);
  const filter = useSelector((state: RootState) => state.filter);

  const isFilterActive = filter.isFilterActive;

  const movies = isFilterActive ? filter.movies : catalog.movies;
  const loading = isFilterActive ? filter.loading : catalog.loading;
  const error = isFilterActive ? filter.error : catalog.error;
  const currentPage = isFilterActive ? filter.currentPage : catalog.currentPage;
  const totalPages = isFilterActive ? filter.totalPages : catalog.totalPages;

  useEffect(() => {
    dispatch(loadMovies({ page: 1, reset: true }));

    return () => {
      dispatch(clearMovies());
    };
  }, [dispatch]);

  const handleShowMore = () => {
    if (currentPage >= totalPages) return;

    if (isFilterActive) {
      dispatch(
        applyFilters({
          genreId: filter.selectedGenre,
          yearFrom: filter.yearFrom,
          yearTo: filter.yearTo,
          page: currentPage + 1,
          reset: false,
        })
      );
    } else {
      dispatch(loadMovies({ page: currentPage + 1, reset: false }));
    }
  };

  const hasMorePages = currentPage < totalPages;
  const title = isFilterActive ? 'Результаты фильтрации' : 'Популярные фильмы';

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>{title}</h1>

      <FilterPanel />

      {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

      {!loading && movies.length === 0 && isFilterActive && (
        <p style={{ color: '#aaa' }}>По вашему запросу ничего не найдено</p>
      )}

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
