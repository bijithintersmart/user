import { useCallback } from "react";
import styles from "../sudoku.module.css";

const SudokuCell = ({ 
  cell, 
  rowIndex, 
  colIndex, 
  initialBoard, 
  solution, 
  selectedCell, 
  isSolved, 
  handleCellChange, 
  isCellCorrect,
  setSelectedCell
}) => {
  const isInitial = initialBoard[rowIndex][colIndex] !== 0;
  const isTopBorder = rowIndex % 3 === 0;
  const isLeftBorder = colIndex % 3 === 0;
  const cellCorrect = isCellCorrect(rowIndex, colIndex);
  const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;

  const handleCellClick = useCallback(() => {
    if (!isInitial && !isSolved) {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  }, [isInitial, isSolved, rowIndex, colIndex, setSelectedCell]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    // Allow only digits 1-9 or empty string
    if (value === "" || (/^[1-9]$/.test(value))) {
      handleCellChange(rowIndex, colIndex, value);
    }
  }, [rowIndex, colIndex, handleCellChange]);

  const handleKeyDown = useCallback((e) => {
    // Prevent non-numeric input
    if (!/^[0-9]$/.test(e.key) && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleNumberButtonClick = useCallback((e, num) => {
    e.stopPropagation(); // Prevent triggering cell selection
    handleCellChange(rowIndex, colIndex, num.toString());
    // Auto-deselect after choosing a number
    setTimeout(() => setSelectedCell(null), 300);
  }, [rowIndex, colIndex, handleCellChange, setSelectedCell]);

  const handleClearButtonClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering cell selection
    handleCellChange(rowIndex, colIndex, "");
    // Auto-deselect after clearing
    setTimeout(() => setSelectedCell(null), 300);
  }, [rowIndex, colIndex, handleCellChange, setSelectedCell]);

  return (
    <div
      onClick={handleCellClick}
      className={`${styles.sudokuCellWrapper} ${
        isTopBorder ? styles.topBorder : ""
      } ${isLeftBorder ? styles.leftBorder : ""} ${
        isSelected ? styles.selectedCell : ""
      } ${
        !isInitial && cell === 0 ? styles.emptyCell : ""
      }`}
    >
      {isInitial ? (
        <div className={styles.initialCell}>{cell}</div>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          pattern="[1-9]"
          maxLength="1"
          value={cell === 0 ? "" : cell}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`${styles.sudokuInput} ${
            cellCorrect === false
              ? styles.incorrectCell
              : cellCorrect === true
                ? styles.correctCell
                : ''
          }`}
          disabled={isSolved}
          autoFocus={isSelected}
          placeholder=""
        />
      )}

      {/* Number buttons appear when cell is selected */}
      {isSelected && !isSolved && (
        <div className={styles.numberButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className={styles.numberButton}
              onClick={(e) => handleNumberButtonClick(e, num)}
            >
              {num}
            </button>
          ))}
          <button
            className={styles.clearButton}
            onClick={handleClearButtonClick}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SudokuCell;