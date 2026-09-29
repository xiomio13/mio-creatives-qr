// src/components/common/SelectGroup/SelectGroup.jsx
import styles from './SelectGroup.module.css';

export const SelectGroup = ({
  label,
  options,
  selectedValue,
  onChange,
  name,
}) => {
  return (
    <div className={styles.groupContainer}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.optionsWrapper} role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`${styles.optionButton} ${isActive ? styles.active : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};