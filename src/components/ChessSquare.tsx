"use client";

import { Piece } from "chess.js";

interface ChessSquareProps {
  square: string;
  piece: Piece | null;
  squareColor: string;
  highlight: string;
  onClick: () => void;
}

const pieceIcons = {
  w: {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
  },
  b: {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  },
};

export default function ChessSquare({
  square,
  piece,
  squareColor,
  highlight,
  onClick,
}: ChessSquareProps) {
  // Debug: Log the highlight prop
  console.log(`ChessSquare ${square} received highlight: "${highlight}"`);

  const getPieceIcon = () => {
    if (!piece) return null;
    return pieceIcons[piece.color][piece.type];
  };

  const getPieceColor = () => {
    if (!piece) return "";
    return piece.color === "w" ? "text-gray-800" : "text-black";
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center cursor-pointer transition-all duration-200 ${squareColor} ${highlight} aspect-square`}
      onClick={onClick}
    >
      {piece && (
        <div className={`text-4xl font-bold ${getPieceColor()} leading-none`}>
          {getPieceIcon()}
        </div>
      )}
    </div>
  );
}
