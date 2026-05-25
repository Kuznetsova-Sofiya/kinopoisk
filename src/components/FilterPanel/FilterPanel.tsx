import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import {
  loadGenres,
  setGenre,
  setYearFrom,
  setYearTo,
  applyFilters,
  resetFilters,
} from '../../redux/slices/filter-slice';
import styles from './FilterPanel.module.scss';

export const FilterPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { genres, genresLoading, selectedGenre, yearFrom, yearTo, isFilterActive, loading } =
    useSelector((state: RootState) => state.filter);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(loadGenres());
    }
  }, [dispatch, genres.length]);

  const handleApply = () => {
    if (!selectedGenre && !yearFrom && !yearTo) {
      dispatch(resetFilters());
      return;
    }
    dispatch(
      applyFilters({
        genreId: selectedGenre,
        yearFrom,
        yearTo,
        page: 1,
        reset: true,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className={styles.panel}>
      <select
        value={selectedGenre ?? ''}
        onChange={(e) => dispatch(setGenre(e.target.value ? Number(e.target.value) : null))}
        className={styles.select}
        disabled={genresLoading}
      >
        <option value="">Все жанры</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.genre}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Год от"
        value={yearFrom}
        onChange={(e) => dispatch(setYearFrom(e.target.value))}
        className={styles.yearInput}
        min={1900}
        max={2025}
      />

      <input
        type="number"
        placeholder="Год до"
        value={yearTo}
        onChange={(e) => dispatch(setYearTo(e.target.value))}
        className={styles.yearInput}
        min={1900}
        max={2025}
      />

      <button onClick={handleApply} className={styles.applyBtn} disabled={loading}>
        {loading ? 'Загрузка...' : 'Применить'}
      </button>

      {isFilterActive && (
        <button onClick={handleReset} className={styles.resetBtn}>
          Сбросить
        </button>
      )}
    </div>
  );
};
