import SudokuCell from './SudokuCell';
import styles from '../sudoku.module.css';

const SudokuBoard = ({
  board,
  initialBoard,
  solution,
  selectedCell,
  isSolved,
  handleCellChange,
  isCellCorrect,
  setSelectedCell
}) => {
  return (
    <div className={styles.sudokuBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.sudokuRow}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              initialBoard={initialBoard}
              solution={solution}
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              isSolved={isSolved}
              handleCellChange={handleCellChange}
              setSelectedCell={setSelectedCell}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;