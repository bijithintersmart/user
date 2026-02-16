"use client";
import { useState, useEffect, useCallback } from "react";
import sudokuStyles from "./sudoku.module.css";
import styles from "@/app/page.module.css";
import SudokuBoard from "./components/SudokuBoard";
import Controls from "./components/Controls";

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

  // Generate a new Sudoku puzzle
  const generateSudoku = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSolution(null);
    setIsSolved(false);

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
        setBoard(data.puzzle);
        setInitialBoard(JSON.parse(JSON.stringify(data.puzzle)));
        // Store the solution if it's provided in the response
        if (data.solution) {
          setSolution(data.solution);
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
      if (solution) {
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

      // Also update the selected cell if needed
      if (
        selectedCell &&
        selectedCell.row === row &&
        selectedCell.col === col
      ) {
        // Keep the cell selected after value change
      }
    },
    [isSolved, initialBoard, selectedCell],
  );

  // Check if a cell's value is correct
  const isCellCorrect = useCallback(
    (row, col) => {
      // Don't validate if there's no solution or if it's an initial cell
      if (!solution || initialBoard[row][col] !== 0) {
        return null;
      }

      // Don't validate empty cells
      if (board[row][col] === 0) {
        return null;
      }

      // Compare user input with solution
      return board[row][col] === solution[row][col];
    },
    [board, initialBoard, solution],
  );

  // Reset the puzzle to initial state
  const resetPuzzle = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setIsSolved(false);
    setError(null);
  }, [initialBoard]);

  // Check the user's answer
  const checkAnswer = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If solution is already available, use it directly
      if (solution) {
        setSolution(solution);
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
          setSolution(data.solution);
        }
      }
    } catch (err) {
      setError("Could not validate your answer: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [initialBoard, solution]);

  // Initialize with a Sudoku puzzle
  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  return (
    <div className={sudokuStyles.sudokuContainer}>
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
            loading={loading}
            isSolved={isSolved}
            solution={solution}
          />

          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            solution={solution}
            selectedCell={selectedCell}
            isSolved={isSolved}
            handleCellChange={handleCellChange}
            isCellCorrect={isCellCorrect}
            setSelectedCell={setSelectedCell}
          />

          {isSolved && (
            <div className={sudokuStyles.solvedMessage}>
              <p>✅ Puzzle Solved! Great job!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}