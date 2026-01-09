"use client";
import FormDropDownBuilder from "@/components/FormDropDownBuilder";
import { useGameStore } from "../../state/GameState";
import Board from "./components/Board";
import GameModeSelector from "./components/GameModeSelector";
import styles from "./page.module.css";
import { ToastContainer } from "react-toastify";

export default function Game() {
  const history = useGameStore((state) => state.history);
  const setHistory = useGameStore((state) => state.setHistory);
  const currentMove = useGameStore((state) => state.currentMove);
  const setCurrentMove = useGameStore((state) => state.setCurrentMove);
  const resetGame = useGameStore((state) => state.resetGame);
  const undoGame = useGameStore((state) => state.undoGame);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const currentGameMode = useGameStore((state) => state.gameMode);
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
  function handleGameModeChange(id, val) {
    setGameMode(val);
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Tic Tac Toe</h1>
        <GameModeSelector
          labelName={"Game Mode"}
          id={"gameMode"}
          value={currentGameMode}
          onChange={handleGameModeChange}
          items={["single", "multi"]}
        />
        <p className={styles.gameInstructions}>
          Take turns placing X and O on the board. The first player to get 3 in
          a row wins!
        </p>
      </div>
      <div className={styles.gameContent}>
        <div className={styles.boardSection}>
          <Board
            xIsNext={xIsNext}
            autoPlay={currentGameMode === "single" && !xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            onReset={resetGame}
            onUndo={undoGame}
            onRestart={resetGame}
          />
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
                    className={`${styles.moveButton} ${
                      currentMove === historyIndex ? styles.currentMove : ""
                    }`}
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
      <ToastContainer />
    </div>
  );
}
