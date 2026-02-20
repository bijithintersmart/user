import styles from "../sudoku.module.css";

const Controls = ({ 
  difficulty, 
  setDifficulty, 
  generateSudoku, 
  checkAnswer, 
  solveSudoku, 
  resetPuzzle, 
  continueGame,
  timer,
  loading, 
  isSolved, 
  solution,
  gameStatus
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className={styles.controls}>
      <div className={styles.timerDisplay}>
        <span className={styles.timerIcon}>⏱️</span>
        {formatTime(timer)}
      </div>
      {gameStatus === "playing" ? (
        <>
          <div className={styles.controlGroup}>
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
          </div>

          <div className={styles.controlGroup}>
            <button
              onClick={checkAnswer}
              className={`${styles.sudokuButton} ${styles.secondaryButton}`}
              disabled={loading || isSolved}
            >
              {solution ? "Disable Answer" : "Check Answer"}
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
          </div>
        </>
      ) : (
        <div className={styles.gameOverControls}>
          {gameStatus === "lost" && (
            <button
              onClick={continueGame}
              className={`${styles.sudokuButton} ${styles.successButton}`}
            >
              Keep Playing
            </button>
          )}
          <button
            onClick={resetPuzzle}
            className={`${styles.sudokuButton} ${styles.dangerButton}`}
          >
            Reset Board
          </button>
          <button
            onClick={generateSudoku}
            className={`${styles.sudokuButton} ${styles.primaryButton}`}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Controls;