"use client";

import { Chess, Move, Square } from "chess.js";
import { useEffect, useState } from "react";
import ChessSquare from "./ChessSquare";

interface ChessBoardProps {
  seed: string;
  playerColor: "w" | "b";
  gameState?: string;
  onGameStateUpdate: (gameState: string) => void;
}

export default function ChessBoard({
  seed,
  playerColor,
  gameState,
  onGameStateUpdate,
}: ChessBoardProps) {
  const [chess, setChess] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize game from URL state if provided
  useEffect(() => {
    if (gameState) {
      try {
        const newChess = new Chess();
        newChess.load(gameState);
        setChess(newChess);
        updateLegalMoves(newChess);
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    }
  }, [gameState]);

  // Handle AI going first (when player chooses black)
  useEffect(() => {
    if (playerColor === "b" && chess.turn() === "w" && !gameState) {
      makeAIMove();
    }
  }, [playerColor, chess, gameState]);

  const updateLegalMoves = (chessInstance: Chess) => {
    const moves = chessInstance.moves({ verbose: true });
    setLegalMoves(moves);
  };

  const makeAIMove = async () => {
    if (chess.isGameOver()) return;

    setIsLoading(true);
    setIsAITurn(true);

    try {
      const response = await fetch("/api/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen: chess.fen(),
          seed: seed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI move");
      }

      const data = await response.json();
      const move = data.move;

      // Make the AI move
      const newChess = new Chess(chess.fen());
      newChess.move(move);
      setChess(newChess);
      updateLegalMoves(newChess);

      // Update URL with new game state
      onGameStateUpdate(newChess.fen());
    } catch (error) {
      console.error("Error making AI move:", error);
    } finally {
      setIsLoading(false);
      setIsAITurn(false);
    }
  };

  const handleSquareClick = (square: string) => {
    if (isLoading || isAITurn) return;

    const squarePiece = chess.get(square as Square) || null;
    const isPlayerPiece = squarePiece && squarePiece.color === playerColor;

    // If clicking on a player's piece
    if (isPlayerPiece) {
      if (selectedSquare === square) {
        // Deselect if clicking the same piece
        setSelectedSquare(null);
      } else {
        // Select the new piece
        setSelectedSquare(square);
      }
      return;
    }

    // If a piece is selected and clicking on a different square
    if (selectedSquare) {
      const move = {
        from: selectedSquare as Square,
        to: square as Square,
        promotion: "q" as const, // Always promote to queen for simplicity
      };

      try {
        const newChess = new Chess(chess.fen());
        const result = newChess.move(move);

        if (result) {
          setChess(newChess);
          updateLegalMoves(newChess);
          setSelectedSquare(null);

          // Update URL with new game state
          onGameStateUpdate(newChess.fen());

          // If game is not over, it's AI's turn
          if (!newChess.isGameOver()) {
            setTimeout(() => makeAIMove(), 500); // Small delay for better UX
          }
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }
    }
  };

  const isLegalMove = (square: string) => {
    return legalMoves.some((move) => move.to === square);
  };

  const getSquareColor = (file: number, rank: number) => {
    return (file + rank) % 2 === 0 ? "bg-amber-100" : "bg-amber-800";
  };

  const getSquareHighlight = (square: string) => {
    if (selectedSquare === square) return "ring-4 ring-blue-500";
    if (isLegalMove(square)) return "ring-2 ring-green-500";
    return "";
  };

  const renderBoard = () => {
    const squares = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = `${files[file]}${ranks[rank]}`;
        const piece = chess.get(square as Square) || null;
        const squareColor = getSquareColor(file, rank);
        const highlight = getSquareHighlight(square);

        squares.push(
          <ChessSquare
            key={square}
            square={square}
            piece={piece}
            squareColor={squareColor}
            highlight={highlight}
            onClick={() => handleSquareClick(square)}
          />,
        );
      }
    }

    return squares;
  };

  const getGameStatus = () => {
    if (chess.isCheckmate()) return "Checkmate!";
    if (chess.isDraw()) return "Draw!";
    if (chess.isCheck()) return "Check!";
    if (isAITurn) return "AI is thinking...";
    if (chess.turn() === playerColor) return "Your turn";
    return "AI turn";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-xl font-semibold mb-2">{getGameStatus()}</div>
        {isLoading && (
          <div className="text-sm text-gray-600">AI is calculating...</div>
        )}
      </div>

      <div className="grid grid-cols-8 w-96 h-96 border-4 border-gray-800 rounded-lg overflow-hidden">
        {renderBoard()}
      </div>

      <div className="mt-4 text-sm text-gray-600">{chess.fen()}</div>
    </div>
  );
}
