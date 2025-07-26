"use client";

import { isInitialPosition } from "@/utils/boardState";
import { Chess, Square } from "chess.js";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>(
    "Waiting for game to start...",
  );

  // Create chess instance from URL state using useMemo
  const chess = useMemo(() => {
    if (!gameState) {
      return new Chess();
    }

    try {
      const newChess = new Chess();
      newChess.load(gameState);
      return newChess;
    } catch (error) {
      console.error("Failed to load game state:", error);
      return new Chess();
    }
  }, [gameState]);

  // Memoize chess properties to prevent infinite re-renders
  const chessTurn = useMemo(() => chess.turn(), [chess]);
  const chessFen = useMemo(() => chess.fen(), [chess]);

  // Calculate legal moves using useMemo
  const legalMoves = useMemo(() => {
    return chess.moves({ verbose: true });
  }, [chess]);

  const makeAIMoveWithFEN = useCallback(
    async (fen: string) => {
      if (new Chess(fen).isGameOver()) return;

      console.log("=== AI MOVE WITH FEN START ===");
      console.log("FEN provided to AI move:", fen);
      console.log("Current turn from FEN:", new Chess(fen).turn());
      console.log("Player color:", playerColor);
      console.log(
        "AI should play as:",
        new Chess(fen).turn() === "w" ? "white" : "black",
      );

      setGameStatus("AI is thinking...");
      setIsLoading(true);
      setIsAITurn(true);

      try {
        setGameStatus("Making request to backend...");
        const response = await fetch("/api/move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: fen,
            seed: seed,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI move");
        }

        setGameStatus("Received response from backend, applying move...");
        const data = await response.json();
        const move = data.move;

        console.log("AI move received:", move);
        console.log("AI move data:", data);

        // Make the AI move and update URL immediately
        const newChess = new Chess(fen);
        const result = newChess.move(move);

        console.log("AI move result:", result);
        console.log("New FEN after AI move:", newChess.fen());
        console.log("New turn after AI move:", newChess.turn());
        console.log("=== AI MOVE WITH FEN END ===");

        // Update URL with new game state - this is now the source of truth
        onGameStateUpdate(newChess.fen());

        setGameStatus("AI move completed. Your turn!");
      } catch (error) {
        console.error("Error making AI move:", error);
        setGameStatus("Error making AI move!");
      } finally {
        setIsLoading(false);
        setIsAITurn(false);
      }
    },
    [seed, playerColor, onGameStateUpdate],
  );

  // Initialize game status when chess instance changes
  useEffect(() => {
    if (chessTurn === playerColor) {
      setGameStatus("Your turn! Select a piece to move.");
    } else {
      setGameStatus("AI's turn. Please wait...");
    }
  }, [chessTurn, playerColor]);

  // Handle AI going first (when player chooses black)
  useEffect(() => {
    if (playerColor === "b" && chessTurn === "w" && gameState) {
      // Check if this is the initial position (no moves made yet)
      if (isInitialPosition(gameState)) {
        setGameStatus("AI goes first. Starting AI move...");
        makeAIMoveWithFEN(chessFen);
      }
    }
  }, [playerColor, chessTurn, gameState, chessFen, makeAIMoveWithFEN]);

  // Debug logging for state changes
  useEffect(() => {
    console.log("Chess state changed:", {
      fen: chessFen,
      turn: chessTurn,
      playerColor,
      gameStatus,
      isAITurn,
      isLoading,
    });
  }, [chessFen, chessTurn, playerColor, gameStatus, isAITurn, isLoading]);

  const handleSquareClick = useCallback(
    (square: string) => {
      if (isLoading || isAITurn) return;

      console.log("=== SQUARE CLICK ===");
      console.log("Square clicked:", square);
      console.log("Current turn:", chessTurn);
      console.log("Player color:", playerColor);
      console.log("Is player's turn:", chessTurn === playerColor);

      // Check if it's the player's turn
      if (chessTurn !== playerColor) {
        console.log("NOT PLAYER'S TURN - blocking move");
        setGameStatus("Not your turn! Wait for AI to move.");
        return;
      }

      console.log("PLAYER'S TURN - allowing move");

      const squarePiece = chess.get(square as Square) || null;
      const isPlayerPiece = squarePiece && squarePiece.color === playerColor;

      // If clicking on a player's piece
      if (isPlayerPiece) {
        if (selectedSquare === square) {
          // Deselect if clicking the same piece
          setSelectedSquare(null);
          setGameStatus("Piece deselected. Your turn!");
        } else {
          // Select the new piece
          setSelectedSquare(square);
          setGameStatus(
            `Selected ${squarePiece.type} at ${square}. Choose destination.`,
          );
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
          setGameStatus("Making your move...");
          console.log("=== PLAYER MOVE START ===");
          console.log("Current FEN before player move:", chessFen);
          console.log("Current turn before player move:", chessTurn);
          console.log("Player color:", playerColor);

          const newChess = new Chess(chessFen);
          const result = newChess.move(move);

          if (result) {
            console.log("Player move result:", result);
            console.log("New FEN after player move:", newChess.fen());
            console.log("New turn after player move:", newChess.turn());
            console.log("=== PLAYER MOVE END ===");

            setSelectedSquare(null);

            setGameStatus("Your move completed. AI is thinking...");

            // Update URL with new game state - this is the source of truth
            onGameStateUpdate(newChess.fen());

            // If game is not over, it's AI's turn
            if (!newChess.isGameOver()) {
              // Use the new FEN directly instead of relying on the chess instance
              setTimeout(() => makeAIMoveWithFEN(newChess.fen()), 500);
            } else {
              setGameStatus("Game over!");
            }
          }
        } catch (error) {
          console.error("Invalid move:", error);
          setGameStatus("Invalid move! Try again.");
        }
      }
    },
    [
      isLoading,
      isAITurn,
      chessTurn,
      playerColor,
      chess,
      selectedSquare,
      chessFen,
      onGameStateUpdate,
      makeAIMoveWithFEN,
    ],
  );

  const isLegalMove = useCallback(
    (square: string) => {
      return legalMoves.some((move) => move.to === square);
    },
    [legalMoves],
  );

  const getSquareColor = useCallback((file: number, rank: number) => {
    return (file + rank) % 2 === 0 ? "bg-amber-100" : "bg-amber-800";
  }, []);

  const getSquareHighlight = useCallback(
    (square: string) => {
      if (selectedSquare === square) return "ring-4 ring-blue-500";
      if (isLegalMove(square)) return "ring-2 ring-green-500";
      return "";
    },
    [selectedSquare, isLegalMove],
  );

  const renderBoard = useCallback(() => {
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
  }, [chess, getSquareColor, getSquareHighlight, handleSquareClick]);

  // Memoize the board rendering to prevent unnecessary re-renders
  const memoizedBoard = useMemo(() => renderBoard(), [renderBoard]);

  const getGameStatus = useCallback(() => {
    if (chess.isCheckmate()) return "Checkmate!";
    if (chess.isDraw()) return "Draw!";
    if (chess.isCheck()) return "Check!";
    return gameStatus; // Use our detailed status instead
  }, [chess, gameStatus]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-xl font-semibold mb-2">{getGameStatus()}</div>
        {isLoading && (
          <div className="text-sm text-gray-600">Processing...</div>
        )}
        <div className="text-sm text-gray-500 mt-1">
          Current turn: {chessTurn === "w" ? "White" : "Black"} | Player color:{" "}
          {playerColor === "w" ? "White" : "Black"}
        </div>
      </div>

      <div className="grid grid-cols-8 w-96 h-96 border-4 border-gray-800 rounded-lg overflow-hidden">
        {memoizedBoard}
      </div>

      <div className="mt-4 text-sm text-gray-600">{chessFen}</div>
    </div>
  );
}
