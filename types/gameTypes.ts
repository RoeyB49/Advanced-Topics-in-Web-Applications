export interface Cell {
  id: number;
  value: "X" | "O" | null;
}

export interface BoardProps {
  board: Cell[];
  onClick: (id: number) => void;
}

export interface GameState {
  winner: "X" | "O" | "Draw" | null;
  currentPlayer: "X" | "O";
  board: Cell[];
}
