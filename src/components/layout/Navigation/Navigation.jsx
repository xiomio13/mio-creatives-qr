// src/components/layout/Navigation/Navigation.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navigation.module.css';

export const Navigation = ({ activeTab, onTabChange, historyCount = 0 }) => {
  return (
    <nav className={styles.navContainer} aria-label="Navegación principal">
      <div className={styles.tabGroup} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'generator'}
          className={`${styles.tabButton} ${activeTab === 'generator' ? styles.activeTab : ''}`}
          onClick={() => onTabChange('generator')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Generador
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          className={`${styles.tabButton} ${activeTab === 'history' ? styles.activeTab : ''}`}
          onClick={() => onTabChange('history')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mis Códigos
          {historyCount > 0 && (
            <span className={styles.countBadge}>{historyCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  activeTab: PropTypes.oneOf(['generator', 'history']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  historyCount: PropTypes.number,
};