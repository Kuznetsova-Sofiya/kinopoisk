import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { loadTrends, clearTrends } from '../redux/slices/trends-slice';
import type { AppDispatch, RootState } from '../redux/store';

export const Trends = () => {
  const { page: pageParam } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { movies, currentPage, totalPages, loading, error } = useSelector(
    (state: RootState) => state.trends
  );
  
  const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);
  const hasLoadedRef = useRef<{ [key: number]: boolean }>({});

  // синхронизация page с URL
  useEffect(() => {
    const pageNum = pageParam ? Number(pageParam) : 1;
    if (pageNum !== page && !isNaN(pageNum) && pageNum > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(pageNum);
    }
  }, [pageParam, page]);

  useEffect(() => {

    if (page < 1 || isNaN(page)) {
      navigate('/trends/1');
      return;
    }
    
    // Обработка бесконечной загрузки: если эту страницу уже загружали — не грузим снова
    if (hasLoadedRef.current[page]) {
      return;
    }
    
    if (page === 1) {
      dispatch(clearTrends());
    }
    
    // выводим, что страница загружается
    hasLoadedRef.current[page] = true;
    dispatch(loadTrends({ page }));
    
  }, [page, dispatch, navigate]);

  const handleShowMore = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setPage(nextPage);
      navigate(`/trends/${nextPage}`);
    }
  };

  const hasMorePages = currentPage < totalPages && !loading;

  // первая загрузка
  if (loading && movies.length === 0) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Топ-250 фильмов</h1>
        <p style={{ color: '#aaa' }}>Загрузка</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Топ-250 фильмов</h1>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <p style={{ color: '#aaa' }}>Пожалуйста, попробуйте позже</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Топ-250 фильмов</h1>
      
      {movies.length === 0 && !loading ? (
        <p style={{ color: '#aaa' }}>Фильмы не найдены</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
      
      {loading && (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '32px' }}>
          Загрузка...
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
    fontWeight: 500,
    cursor: 'pointer',
  },
};