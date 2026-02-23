"use client";
import { useState, useEffect, useCallback } from "react";
import sudokuStyles from "./sudoku.module.css";
import SudokuBoard from "./components/SudokuBoard";
import Controls from "./components/Controls";
import BackButton from "@/components/BackButton";

// Pure utility functions defined outside component to avoid hoisting/initialization issues
const isBoardFull = (currentBoard) => {
  return currentBoard.every(row => row.every(cell => cell !== 0));
};

const validateBoard = (currentBoard, finalSolution) => {
  if (!finalSolution) return false;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentBoard[r][c] !== finalSolution[r][c]) {
        return false;
      }
    }
  }
  return true;
};

export default function SudokuPage() {
  const [board, setBoard] = useState(() =>
    Array(9)
      .fill()
      .map(() => Array(9).fill(0)),
  );
  const [initialBoard, setInitialBoard] = useState(() =>
    Array(9)
      .fill()
      .map(() => Array(9).fill(0)),
  );
  const [solution, setSolution] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [fullSolution, setFullSolution] = useState(null);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Generate a new Sudoku puzzle
  const generateSudoku = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSolution(null);
    setFullSolution(null);
    setIsSolved(false);
    setGameStatus("playing");
    setTimer(0);
    setIsActive(true);

    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${difficulty}`,
        {
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
          },
        },
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${responseText}`,
        );
      }

      const data = await response.json();

      if (data && data.puzzle) {
        // Normalize puzzle data: replace null with 0
        const normalizedPuzzle = data.puzzle.map(row => 
          row.map(cell => cell === null ? 0 : cell)
        );
        
        setBoard(normalizedPuzzle);
        setInitialBoard(JSON.parse(JSON.stringify(normalizedPuzzle)));
        // Store the solution if it's provided in the response
        if (data.solution) {
          setFullSolution(data.solution);
        }
      } else {
        setError(
          `Invalid response format from API. Expected puzzle property, got: ${JSON.stringify(
            data,
          )}`,
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  // Solve the current Sudoku puzzle
  const solveSudoku = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If solution is already available, use it directly
      if (fullSolution) {
        setBoard(fullSolution);
        setSolution(fullSolution);
        setIsSolved(true);
      } else if (solution) {
        setBoard(solution);
        setIsSolved(true);
      } else {
        // Fallback to API call if solution is not available
        const response = await fetch(
          "https://api.api-ninjas.com/v1/sudokusolve",
          {
            method: "POST",
            headers: {
              "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              puzzle: board,
            }),
          },
        );

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `API solve request failed with status ${response.status}: ${responseText}`,
          );
        }

        const data = await response.json();

        if (data && data.solution) {
          setFullSolution(data.solution);
          setSolution(data.solution);
          setBoard(data.solution);
          setIsSolved(true);
        } else if (data && data.status === "unsolvable") {
          setError("This puzzle is unsolvable!");
        } else {
          setError(
            `Invalid solve response format. Expected solution property, got: ${JSON.stringify(
              data,
            )}`,
          );
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [board, solution]);

  // Handle cell input
  const handleCellChange = useCallback(
    (row, col, value) => {
      // Only allow editing of cells that were originally empty
      if (initialBoard[row][col] !== 0 || isSolved) return;

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);

        if (value === "") {
          newBoard[row][col] = 0;
        } else {
          const numValue = parseInt(value);
          if (numValue >= 1 && numValue <= 9) {
            newBoard[row][col] = numValue;
          }
        }

        return newBoard;
      });
    },
    [isSolved, initialBoard],
  );

  // Resume game after a "lost" state
  const continueGame = useCallback(() => {
    setGameStatus("playing");
    setIsActive(true);
  }, []);


  // Check for game completion when board changes
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (isBoardFull(board)) {
      const checkResult = async () => {
        let finalSolution = fullSolution;
        
        if (!finalSolution) {
          setLoading(true);
          try {
            const response = await fetch(
              "https://api.api-ninjas.com/v1/sudokusolve",
              {
                method: "POST",
                headers: {
                  "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  puzzle: initialBoard,
                }),
              },
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data.solution) {
                finalSolution = data.solution;
                setFullSolution(finalSolution);
              }
            }
          } catch (err) {
            console.error("Error fetching solution for validation:", err);
          } finally {
            setLoading(false);
          }
        }

        if (finalSolution) {
          const won = validateBoard(board, finalSolution);
          setGameStatus(won ? "won" : "lost");
          setSolution(finalSolution); // Show all correct/incorrect fields
          if (won) setIsSolved(true);
        }
      };

      checkResult();
    }
  }, [board, gameStatus, fullSolution, initialBoard]); // Removed isBoardFull, validateBoard as they are now stable/outside

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && gameStatus === "playing") {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameStatus]);

  // Start timer on first move if not already active
  useEffect(() => {
    if (!isActive && gameStatus === "playing") {
      const isBoardChanged = JSON.stringify(board) !== JSON.stringify(initialBoard);
      if (isBoardChanged) {
        setIsActive(true);
      }
    }
  }, [board, initialBoard, isActive, gameStatus]);

  // Pause timer on game over
  useEffect(() => {
    if (gameStatus !== "playing") {
      setIsActive(false);
    }
  }, [gameStatus]);


  // Reset the puzzle to initial state
  const resetPuzzle = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setIsSolved(false);
    setSolution(null);
    setError(null);
    setGameStatus("playing");
  }, [initialBoard]);


  // Check/Toggle the user's answer
  const checkAnswer = useCallback(async () => {
    if (difficulty === "hard") {
      setError("Check Answer feature is only available in Easy and Medium modes.");
      return;
    }

    // Toggle: if solution is already showing, hide it
    if (solution) {
      setSolution(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // If solution is already available, use it directly
      if (fullSolution) {
        setSolution(fullSolution);
      } else {
        // Fallback to API call if solution is not available
        const response = await fetch(
          "https://api.api-ninjas.com/v1/sudokusolve",
          {
            method: "POST",
            headers: {
              "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              puzzle: initialBoard,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch solution for validation");
        }

        const data = await response.json();
        if (data && data.solution) {
          setFullSolution(data.solution);
          setSolution(data.solution);
        }
      }
    } catch (err) {
      setError("Could not validate your answer: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [initialBoard, solution, fullSolution, difficulty]);

  // Initialize with a Sudoku puzzle
  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  return (
    <div className={sudokuStyles.sudokuContainer}>
      <BackButton />
      <h1 className={sudokuStyles.title}>Sudoku Puzzle</h1>
      <p className={sudokuStyles.subtitle}>
        Challenge yourself with a Sudoku puzzle. Select difficulty and try to
        solve it!
      </p>

      {loading && (
        <div className={sudokuStyles.loadingContainer}>
          <div className={sudokuStyles.spinner}></div>
          <p>Loading Sudoku...</p>
        </div>
      )}

      {error && (
        <div className={sudokuStyles.errorContainer}>
          <p className={sudokuStyles.errorText}>Error: {error}</p>
          <button onClick={generateSudoku} className={sudokuStyles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <Controls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            generateSudoku={generateSudoku}
            checkAnswer={checkAnswer}
            solveSudoku={solveSudoku}
            resetPuzzle={resetPuzzle}
            continueGame={continueGame}
            timer={timer}
            loading={loading}
            isSolved={isSolved}
            solution={solution}
            gameStatus={gameStatus}
          />

          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            solution={solution}
            selectedCell={selectedCell}
            isSolved={isSolved}
            handleCellChange={handleCellChange}
            setSelectedCell={setSelectedCell}
          />

          {gameStatus === "won" && (
            <div className={sudokuStyles.solvedMessage}>
              <p>🎉 Congratulations! You solved the puzzle correctly! ✅</p>
            </div>
          )}

          {gameStatus === "lost" && (
            <div className={sudokuStyles.errorMessage}>
              <p>❌ Some numbers are incorrect. Try to fix them!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}