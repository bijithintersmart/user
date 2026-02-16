import styles from "../sudoku.module.css";

const Controls = ({ 
  difficulty, 
  setDifficulty, 
  generateSudoku, 
  checkAnswer, 
  solveSudoku, 
  resetPuzzle, 
  loading, 
  isSolved, 
  solution 
}) => {
  return (
    <div className={styles.controls}>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className={styles.difficultySelect}
        disabled={loading}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        onClick={generateSudoku}
        className={`${styles.sudokuButton} ${styles.primaryButton}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className={styles.buttonSpinner}></span>
            Generating...
          </>
        ) : (
          "New Puzzle"
        )}
      </button>

      <button
        onClick={checkAnswer}
        className={`${styles.sudokuButton} ${styles.secondaryButton}`}
        disabled={loading || isSolved}
      >
        Check Answer
      </button>

      <button
        onClick={solveSudoku}
        className={`${styles.sudokuButton} ${styles.successButton}`}
        disabled={loading || isSolved}
      >
        {loading ? (
          <>
            <span className={styles.buttonSpinner}></span>
            Solving...
          </>
        ) : (
          "Solve Puzzle"
        )}
      </button>

      <button
        onClick={resetPuzzle}
        className={`${styles.sudokuButton} ${styles.dangerButton}`}
        disabled={loading || !solution}
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;