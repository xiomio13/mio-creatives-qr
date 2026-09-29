// src/components/common/Input/Input.jsx
import styles from "./Input.module.css";

export const Input = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
  disabled = false,
  required = false,
}) => {
  const errorId = `${id}-error`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${styles.input} ${error ? styles.hasError : ""}`}
      />
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
