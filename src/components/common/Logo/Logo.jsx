// src/components/common/Logo/Logo.jsx
import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={styles.logoWrapper}>
      <img
        src="/logo.svg"
        alt="Mio Creatives Logo"
        className={styles.icon}
        width="44"
        height="44"
      />
    </div>
  );
};