// src/components/common/Button/Button.jsx
import styles from "./Button.module.css";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  ariaLabel,
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${isLoading ? styles.loading : ""}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className={styles.spinnerWrapper}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className="sr-only">Cargando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
