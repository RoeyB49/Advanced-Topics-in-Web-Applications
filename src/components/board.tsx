import React from "react";
import { BoardProps } from "../../types/gameTypes";
import "./Board.css";
import XImage from "../images/X.png";
import OImage from "../images/O.png";

export const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((cell) => (
        <div
          key={cell.id}
          className="cell"
          onClick={() => !cell.value && onClick(cell.id)}
          style={{ cursor: cell.value ? "not-allowed" : "pointer" }}
        >
          {cell.value === "X" && (
            <img src={XImage} alt="X" className="cell-image" />
          )}
          {cell.value === "O" && (
            <img src={OImage} alt="O" className="cell-image" />
          )}
        </div>
      ))}
    </div>
  );
};
