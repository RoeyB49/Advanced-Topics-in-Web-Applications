import React, { useState } from "react";
import { Board } from "./components/board";
import { Cell, GameState } from "../types/gameTypes";
import "./App.css";

const App: React.FC = () => {
  const initialBoard: Cell[] = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    value: null,
  }));

  const [state, setState] = useState<GameState>({
    winner: null,
    currentPlayer: "X",
    board: initialBoard,
  });

  const checkWinner = (board: Cell[]): "X" | "O" | "Draw" | null => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a].value &&
        board[a].value === board[b].value &&
        board[a].value === board[c].value
      ) {
        return board[a].value;
      }
    }

    return board.every((cell) => cell.value) ? "Draw" : null;
  };

  const handleClick = (id: number) => {
    if (state.winner || state.board[id].value) return;

    const newBoard = state.board.map((cell) =>
      cell.id === id ? { ...cell, value: state.currentPlayer } : cell
    );

    const winner = checkWinner(newBoard);
    setState({
      board: newBoard,
      currentPlayer: state.currentPlayer === "X" ? "O" : "X",
      winner,
    });
  };

  const resetGame = () => {
    setState({
      winner: null,
      currentPlayer: "X",
      board: initialBoard,
    });
  };

  return (
    <div className="app">
      <h1>X Mix Drix</h1>
      <div className="board-container">
        <Board board={state.board} onClick={handleClick} />
      </div>
      <div className="result">
        {state.winner && (
          <>
            <h2>
              {state.winner === "Draw"
                ? "It's a draw!"
                : `${state.winner} wins!`}
            </h2>
            <button onClick={resetGame}>Play Again</button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
