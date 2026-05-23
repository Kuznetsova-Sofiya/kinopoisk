import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchFavoriteMovies } from '../redux/slices/favorites-slice';

export const Favorites = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesIds = useSelector((state: RootState) => state.favorites.items);
  const favoriteMovies = useSelector((state: RootState) => state.favorites.movies);
  const loading = useSelector((state: RootState) => state.favorites.loading);
  const error = useSelector((state: RootState) => state.favorites.error);

  // Загружаем каждый раз при входе и при изменении списка ID
  useEffect(() => {
    if (favoritesIds.length > 0) {
      dispatch(fetchFavoriteMovies(favoritesIds));
    }
  }, [favoritesIds.length, dispatch]);

  if (loading) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Избранное</h1>
        <p style={{ color: '#aaa' }}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'white', marginBottom: '24px' }}>Избранное</h1>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Избранное</h1>
      
      {favoriteMovies.length === 0 ? (
        <p style={{ color: '#aaa' }}>У вас пока нет избранных фильмов</p>
      ) : (
        <MovieGrid movies={favoriteMovies} />
      )}
    </div>
  );
};