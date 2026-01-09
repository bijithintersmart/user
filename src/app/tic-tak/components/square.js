import styles from './square.module.css';

export default function Square({ value, onSquareClick }) {
  return (
    <button
      className={`${styles.square} ${value ? styles.filled : ''}`}
      onClick={onSquareClick}
    >
      {value && (
        <span className={`${styles.symbol} ${value === 'X' ? styles.xSymbol : styles.oSymbol}`}>
          {value}
        </span>
      )}
    </button>
  );
}