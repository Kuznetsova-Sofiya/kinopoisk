import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadMovieById, clearMovie } from '../redux/slices/movie-slice';
import { toggleFavorite } from '../redux/slices/favorites-slice';
import { loadGenres } from '../redux/slices/filter-slice';
import { fetchFilteredMovies } from '../services/api';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { AppDispatch, RootState } from '../redux/store';
import type { Movie } from '../types/movie';

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { movie, loading, error } = useSelector((state: RootState) => state.movie);
  const favorites = useSelector((state: RootState) => state.favorites?.items || []);
  const allGenres = useSelector((state: RootState) => state.filter.genres);
  const isFavorite = favorites.includes(Number(id));

  const RECS_PER_PAGE = 5;
  const [allRecs, setAllRecs] = useState<Movie[]>([]);
  const [recDisplayCount, setRecDisplayCount] = useState(RECS_PER_PAGE);
  const [recApiPage, setRecApiPage] = useState(1);
  const [recTotalApiPages, setRecTotalApiPages] = useState(0);
  const [recGenreId, setRecGenreId] = useState<number | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/'); return; }
    const movieId = Number(id);
    if (isNaN(movieId) || movieId <= 0) { navigate('/'); return; }

    dispatch(loadMovieById(movieId));
    return () => { dispatch(clearMovie()); };
  }, [id, dispatch, navigate]);

  // сброс рекомендаций при переходе на другой фильм
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllRecs([]);
    setRecDisplayCount(RECS_PER_PAGE);
    setRecApiPage(1);
    setRecTotalApiPages(0);
    setRecGenreId(null);
  }, [id]);

  // загружаем жанры если их ещё нет (могли не заходить на главную)
  useEffect(() => {
    if (allGenres.length === 0) {
      dispatch(loadGenres());
    }
  }, [dispatch, allGenres.length]);

  // загружаем первую страницу рекомендаций когда фильм и жанры готовы
  useEffect(() => {
    if (!movie || allGenres.length === 0) return;

    const primaryGenreName = movie.genres?.[0]?.genre;
    if (!primaryGenreName) return;

    const matched = allGenres.find((g) => g.genre === primaryGenreName);
    if (!matched) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecGenreId(matched.id);
    setRecLoading(true);

    fetchFilteredMovies({ genreId: matched.id, order: 'RATING', page: 1 })
      .then((data) => {
        const recs = (data.items || []).filter((m) => m.kinopoiskId !== movie.kinopoiskId);
        setAllRecs(recs);
        setRecTotalApiPages(data.totalPages);
        setRecApiPage(1);
        setRecDisplayCount(RECS_PER_PAGE);
      })
      .catch(() => setAllRecs([]))
      .finally(() => setRecLoading(false));
  }, [movie, allGenres]);

  const displayedRecs = allRecs.slice(0, recDisplayCount);
  const hasMoreRecs = recDisplayCount < allRecs.length || recApiPage < recTotalApiPages;

  const handleShowMoreRecs = () => {
    const nextCount = recDisplayCount + RECS_PER_PAGE;

    if (nextCount <= allRecs.length) {
      // достаточно данных в буфере
      setRecDisplayCount(nextCount);
    } else if (recApiPage < recTotalApiPages && recGenreId !== null) {
      // подгружаем следующую страницу из API
      setRecLoading(true);
      const nextApiPage = recApiPage + 1;
      fetchFilteredMovies({ genreId: recGenreId ?? undefined, order: 'RATING', page: nextApiPage })
        .then((data) => {
          const newRecs = (data.items || []).filter((m) => m.kinopoiskId !== movie!.kinopoiskId);
          setAllRecs((prev) => {
            const existingIds = new Set(prev.map((m) => m.kinopoiskId));
            return [...prev, ...newRecs.filter((m) => !existingIds.has(m.kinopoiskId))];
          });
          setRecApiPage(nextApiPage);
          setRecDisplayCount(nextCount);
        })
        .finally(() => setRecLoading(false));
    }
  };

  const handleFavoriteClick = () => {
    const movieId = Number(id);
    if (!isNaN(movieId) && movieId > 0) dispatch(toggleFavorite(movieId));
  };

  if (loading) {
    return <div><p style={{ color: '#aaa' }}>Загрузка...</p></div>;
  }

  if (error || !movie) {
    return <div><p style={{ color: 'red' }}>{error || 'Фильм не найден'}</p></div>;
  }

  const title = movie.nameRu || movie.nameEn || 'Без названия';
  const genresText = movie.genres?.map((g) => g.genre).join(' • ') || '';
  const countries = movie.countries?.map((c) => c.country).join(', ') || '';
  const rating = movie.ratingKinopoisk?.toFixed(1) || 'Нет';
  const year = movie.year || 'Нет';
  const length = movie.filmLength ? `${movie.filmLength} мин` : 'Нет';
  const description = movie.description || movie.shortDescription || 'Описание отсутствует';

  return (
    <div style={styles.container}>
      {/* ── Основной блок ── */}
      <div style={styles.movieContainer}>
        <div style={styles.posterColumn}>
          <img src={movie.posterUrl} alt={title} style={styles.poster} />
          <button onClick={handleFavoriteClick} style={styles.favoriteButton}>
            {isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное'}
          </button>
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
              <span style={styles.detailValue}>{genresText || 'Нет'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Рекомендации ── */}
      {(recLoading || allRecs.length > 0) && (
        <div style={styles.recommendations}>
          <h2 style={styles.recTitle}>Рекомендации</h2>
          {recLoading && allRecs.length === 0 ? (
            <p style={{ color: '#aaa' }}>Загрузка...</p>
          ) : (
            <>
              <MovieGrid movies={displayedRecs} />

              {recLoading && (
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '24px' }}>
                  Загрузка...
                </p>
              )}

              {!recLoading && hasMoreRecs && (
                <div style={styles.buttonWrapper}>
                  <button onClick={handleShowMoreRecs} style={styles.button}>
                    Show more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
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
  favoriteButton: {
    marginTop: '16px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#242426',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '12px',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
    alignItems: 'center',
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
  recommendations: {
    marginTop: '48px',
    paddingTop: '32px',
    borderTop: '1px solid #333',
  },
  recTitle: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold' as const,
    marginBottom: '24px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
  },
  button: {
    backgroundColor: '#242426',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '40px',
    fontSize: '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
  },
};
