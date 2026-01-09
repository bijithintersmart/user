import Square from './square'
import styles from './Board.module.css';

export default function Board({
  xIsNext,
  squares,
  onPlay,
  onReset,
  onUndo,
  onRestart,
}) {
  const winner = calculateWinner(squares);
  const turns = calculateTurns(squares);
  const player = xIsNext ? "X" : "O";
  const status = calculateStatus(winner, turns, player);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = player;
    onPlay(nextSquares);
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.statusDisplay}>
        <h2 className={styles.status}>{status}</h2>
        <div className={styles.playerIndicator}>
          <span
            className={`${styles.player} ${
              xIsNext ? styles.playerX : styles.playerO
            }`}
          >
            Current Player: {player}
          </span>
        </div>
      </div>
      <div className={styles.board}>
        {squares.map((_, i) => (
          <Square
            key={`square-${i}`}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
      {/* Show button group only when game is still ongoing */}
      {!winner && turns > 0 ? (
        <div className={styles.buttonGroup}>
          <button className={styles.resetButton} onClick={onReset}>
            Reset Game
          </button>
          <button
            className={styles.undoButton}
            onClick={onUndo}
            disabled={squares.every((square) => !square)}
          >
            Undo Move
          </button>
        </div>
      ) : null}
      {winner && (
        <div className={styles.winnerAnnouncement}>
          🎉 Player <span className={styles.winnerSymbol}>{winner}</span> wins!
          🎉
          <div className={styles.winnerButtonGroup}>
            <button className={styles.restartButton} onClick={onRestart}>
              Restart Game
            </button>
          </div>
        </div>
      )}
      {!winner && !turns && (
        <div className={styles.drawAnnouncement}>
          🤝 It's a draw! 🤝
          <div className={styles.winnerButtonGroup}>
            <button className={styles.restartButton} onClick={onRestart}>
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length;
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return "Game ended in a draw";
  if (winner) return `Player ${winner} wins!`;
  return `Next player: ${player}`;
}
