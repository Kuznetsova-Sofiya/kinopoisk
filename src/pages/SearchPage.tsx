import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../types/movie';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const keyword = searchParams.get('q') || '';

  // сбрасываем при новом поисковом запросе
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllMovies([]);
    setPage(1);
    setTotalPages(0);
    setHasSearched(false);
  }, [keyword]);

  // загрузка фильмов при изменении страницы или ключевого слова
  useEffect(() => {
    if (!keyword) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
        const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=${page}`;
        
        const response = await fetch(url, {
          headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();

        // v2.1 возвращает filmId вместо kinopoiskId — нормализуем
        const films = (data.films || []).map((film: Movie) => ({
          ...film,
          kinopoiskId: film.kinopoiskId || film.filmId || 0,
        }));

        if (page === 1) {
          setAllMovies(films);
        } else {
          setAllMovies(prev => [...prev, ...films]);
        }
        
        setTotalPages(data.pagesCount || 0);
        setHasSearched(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, page]);

  const handleShowMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const hasMorePages = page < totalPages;

  // показываем сообщение, если не было поиска
  if (!hasSearched && !loading && !keyword) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Поиск фильмов</h1>
        <p style={{ color: '#aaa' }}>Введите запрос в строку поиска</p>
      </div>
    );
  }

  // первая загрузка
  if (loading && allMovies.length === 0) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>
          Поиск: "{keyword}"
        </h1>
        <p style={{ color: '#aaa' }}>Загрузка</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>
          Результат поиска: "{keyword}"
        </h1>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <p style={{ color: '#aaa' }}>Пожалуйста, попробуйте позже</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>
        Результаты поиска: "{keyword}"
      </h1>
      
      {allMovies.length === 0 ? (
        <p style={{ color: '#aaa' }}>Ничего не найдено</p>
      ) : (
        <>
          <MovieGrid movies={allMovies} />
          
          {loading && (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '32px' }}>
              Загрузка
            </p>
          )}
          
          {!loading && hasMorePages && (
            <div style={styles.buttonWrapper}>
              <button onClick={handleShowMore} style={styles.button}>
                Show more
              </button>
            </div>
          )}
        </>
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