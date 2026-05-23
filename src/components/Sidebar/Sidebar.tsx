import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';

export const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/trends', label: 'Trends' },
    { path: '/favorites', label: 'Favorites' },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <Link to={item.path} className={styles.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};