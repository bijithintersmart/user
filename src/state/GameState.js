import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useGameStore = create(
  combine(
    {
      history: [Array(9).fill(null)],
      currentMove: 0,
      gameMode: "single",
    },
    (set, get) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory == "function"
                ? nextHistory(state.history)
                : nextHistory,
          }));
        },
        setCurrentMove: (nextMove) => {
          set((state) => ({
            currentMove:
              typeof nextMove == "function"
                ? nextMove(state.currentMove)
                : nextMove,
          }));
        },
        resetGame: () => {
          set(() => ({
            history: [Array(9).fill(null)],
            currentMove: 0,
          }));
        },
        setGameMode: (newGameMode) => {
          set(() => ({
            gameMode: newGameMode,
          }));
        },
        undoGame: () => {
          set((state) => {
            if (state.currentMove <= 2) {
              return state;
            }
            const newHistory = state.history.slice(0, -1);
            const newCurrentMove = Math.max(0, state.currentMove - 1);
            return {
              history: newHistory,
              currentMove: newCurrentMove,
            };
          });
        },
      };
    }
  )
);