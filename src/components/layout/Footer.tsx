import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <p>2026 KinoPoisk</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center' as const,
    padding: '16px',
    backgroundColor: '#1a1a1a',
    color: '#888',
    borderTop: '1px solid #333',
    marginTop: 'auto',
  },
};