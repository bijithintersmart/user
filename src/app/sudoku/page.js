"use client";
import { useState, useEffect } from "react";
import styles from "@/app/page.module.css";

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

  const generateSudoku = async () => {
    setLoading(true);
    setError(null);
    setSolution(null);
    setIsSolved(false); 

    try {
      console.log("Generating Sudoku with difficulty:", difficulty);

      const response = await fetch(
        `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${difficulty}`,
        {
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
          },
        },
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${responseText}`,
        );
      }

      const data = await response.json();
      console.log("Parsed data:", data);

      if (data && data.puzzle) {
        setBoard(data.puzzle);
        setInitialBoard(JSON.parse(JSON.stringify(data.puzzle)));
        // Store the solution if it's provided in the response
        if (data.solution) {
          setSolution(data.solution);
        }
        console.log("Puzzle loaded successfully!");
      } else {
        setError(
          `Invalid response format from API. Expected puzzle property, got: ${JSON.stringify(
            data,
          )}`,
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("Error generating Sudoku:", err);
    } finally {
      setLoading(false);
    }
  };

  const solveSudoku = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Solving Sudoku puzzle...");
      
      // If solution is already available, use it directly
      if (solution) {
        setBoard(solution);
        setIsSolved(true);
        console.log("Puzzle solved using stored solution!");
      } else {
        // Fallback to API call if solution is not available
        console.log("Solution not available, calling API...");
        console.log("Sending puzzle to solve:", board);

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

        console.log("Solve response status:", response.status);

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `API solve request failed with status ${response.status}: ${responseText}`,
          );
        }

        const data = await response.json();
        console.log("Solve parsed data:", data);

        if (data && data.solution) {
          setSolution(data.solution);
          setBoard(data.solution);
          setIsSolved(true);
          console.log("Puzzle solved successfully!");
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
      console.error("Error solving Sudoku:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = (row, col, value) => {
    if (initialBoard[row][col] === 0 && !isSolved) {
      const newBoard = board.map((r) => [...r]); 

      if (value === "") {
        newBoard[row][col] = 0; 
      } else {
        const numValue = parseInt(value);
        if (numValue >= 1 && numValue <= 9) {
          newBoard[row][col] = numValue;
        }
      }

      setBoard(newBoard);
    }
  };

  const isCellCorrect = (row, col) => {
    if (!solution || initialBoard[row][col] !== 0) {
      return null; 
    }

    if (board[row][col] === 0) {
      return null; 
    }

    return board[row][col] === solution[row][col];
  };

  const resetPuzzle = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setIsSolved(false);
    setError(null);
    // Don't clear the solution - keep it available for solving
  };

  const checkAnswer = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Checking answer...");
      
      // If solution is already available, use it directly
      if (solution) {
        console.log("Solution already available, using stored solution for validation");
        setSolution(solution);
      } else {
        // Fallback to API call if solution is not available
        console.log("Solution not available, calling API for validation...");
        
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
  };

  useEffect(() => {
    generateSudoku();
  }, []);

  return (
    <div className={styles.sudokuContainer}>
      <h1 className={styles.title}>Sudoku Puzzle</h1>
      <p className={styles.subtitle}>
        Challenge yourself with a Sudoku puzzle. Select difficulty and try to
        solve it!
      </p>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading Sudoku...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Error: {error}</p>
          <button onClick={generateSudoku} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
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

          <div className={styles.sudokuBoard}>
            {Array.isArray(board) &&
              board.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.sudokuRow}>
                  {Array.isArray(row) &&
                    row.map((cell, colIndex) => {
                      const isInitial = initialBoard[rowIndex][colIndex] !== 0;
                      const isTopBorder = rowIndex % 3 === 0;
                      const isLeftBorder = colIndex % 3 === 0;
                      const cellCorrect = isCellCorrect(rowIndex, colIndex);

                      const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;

                      return (
                        <div
                          key={colIndex}
                          onClick={() => !isInitial && !isSolved && setSelectedCell({ row: rowIndex, col: colIndex })}
                          className={`${styles.sudokuCellWrapper} ${
                            isTopBorder ? styles.topBorder : ""
                          } ${isLeftBorder ? styles.leftBorder : ""} ${
                            isSelected ? styles.selectedCell : ""
                          }`}
                        >
                          {isInitial ? (
                            <div className={styles.initialCell}>{cell}</div>
                          ) : (
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[1-9]"
                              maxLength={1}
                              value={cell === 0 ? "" : cell}
                              onChange={(e) =>
                                handleCellChange(
                                  rowIndex,
                                  colIndex,
                                  e.target.value,
                                )
                              }
                              className={`${styles.sudokuInput} ${
                                cellCorrect === false
                                  ? styles.incorrectCell
                                  : ""
                              } ${cellCorrect === true ? styles.correctCell : ""}`}
                              disabled={isSolved}
                            />
                          )}
                          
                          {/* Number buttons appear when cell is selected */}
                          {isSelected && !isSolved && (
                            <div className={styles.numberButtons}>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                  key={num}
                                  className={styles.numberButton}
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleCellChange(rowIndex, colIndex, num.toString());
                                    setTimeout(() => setSelectedCell(null), 300);
                                  }}
                                >
                                  {num}
                                </button>
                              ))}
                              <button
                                className={styles.clearButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCellChange(rowIndex, colIndex, "");
                                  setTimeout(() => setSelectedCell(null), 300);
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
          </div>

          {isSolved && (
            <div className={styles.solvedMessage}>
              <p>✅ Puzzle Solved! Great job!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
