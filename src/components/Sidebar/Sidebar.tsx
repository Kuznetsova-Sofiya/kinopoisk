import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';

export const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Home', end: true },
    { path: '/trends', label: 'Trends', end: false },
    { path: '/favorites', label: 'Favorites', end: false },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};