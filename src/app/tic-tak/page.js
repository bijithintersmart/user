"use client"
import {useGameStore} from "../../state/GameState";
import Board from './components/Board'
import styles from './page.module.css';

export default function Game() {
  const history = useGameStore((state) => state.history);
  const setHistory = useGameStore((state) => state.setHistory);
  const currentMove = useGameStore((state) => state.currentMove);
  const setCurrentMove = useGameStore((state) => state.setCurrentMove);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Tic Tac Toe</h1>
        <p className={styles.gameInstructions}>Take turns placing X and O on the board. The first player to get 3 in a row wins!</p>
      </div>
      <div className={styles.gameContent}>
        <div className={styles.boardSection}>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className={styles.movesSection}>
          <h3>Game History</h3>
          <ol className={styles.movesList}>
            {history.map((_, historyIndex) => {
              const description =
                historyIndex > 0
                  ? `Go to move #${historyIndex}`
                  : "Go to game start";

              return (
                <li key={historyIndex}>
                  <button
                    className={`${styles.moveButton} ${currentMove === historyIndex ? styles.currentMove : ''}`}
                    onClick={() => jumpTo(historyIndex)}
                  >
                    {description}
                    {currentMove === historyIndex && " ← Current"}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
