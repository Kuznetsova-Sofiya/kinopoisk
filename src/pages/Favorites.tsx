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

  useEffect(() => {
    if (favoritesIds.length > 0 && favoriteMovies.length === 0 && !loading) {
      dispatch(fetchFavoriteMovies(favoritesIds));
    }
  }, [favoritesIds, favoriteMovies.length, loading, dispatch]);

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