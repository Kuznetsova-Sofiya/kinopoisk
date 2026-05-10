import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.main}>
        <Sidebar />
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#0d0d0d',
  },
};