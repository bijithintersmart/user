import React, { useCallback, useMemo } from "react";
import styles from "../sudoku.module.css";

const SudokuCell = React.memo(({ 
  cell, 
  rowIndex, 
  colIndex, 
  initialBoard, 
  solution, 
  isSelected, 
  isSolved, 
  handleCellChange, 
  setSelectedCell
}) => {
  const isInitial = initialBoard[rowIndex][colIndex] !== 0;
  const isTopBorder = rowIndex % 3 === 0;
  const isLeftBorder = colIndex % 3 === 0;
  
  // Calculate correctness internally based on solution prop
  const cellCorrect = useMemo(() => {
    if (!solution || isInitial) return null;
    if (cell === 0) return null;
    return cell === solution[rowIndex][colIndex];
  }, [cell, solution, initialBoard, rowIndex, colIndex, isInitial]);

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

    </div>
  );
});

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;