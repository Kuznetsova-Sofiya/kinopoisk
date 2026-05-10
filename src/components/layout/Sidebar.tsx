import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', label: 'Home' },
  ];

  return (
    <aside style={styles.sidebar}>
      <nav>
        <ul style={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.path} style={styles.navItem}>
              <Link to={item.path} style={styles.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#141414',
    borderRight: '1px solid #333',
    padding: '24px 16px',
    minHeight: 'calc(100vh - 120px)',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '16px',
  },
  navLink: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'block',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
};