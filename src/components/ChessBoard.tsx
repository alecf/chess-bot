"use client";

import { isInitialPosition } from "@/utils/boardState";
import { Chess, Square } from "chess.js";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>(
    "Waiting for game to start...",
  );
  const [invalidMoveMessage, setInvalidMoveMessage] = useState<string | null>(
    null,
  );
  const [playerLastMove, setPlayerLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [aiLastMove, setAILastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

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

      setGameStatus("AI is thinking...");
      setIsLoading(true);
      setIsAITurn(true);

      try {
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

        const data = await response.json();
        const move = data.move;

        // Make the AI move and update URL immediately
        const newChess = new Chess(fen);
        const result = newChess.move(move);

        // Update URL with new game state - this is now the source of truth
        onGameStateUpdate(newChess.fen());

        // Set the last move for highlighting
        // Parse UCI move format (e.g., "e2e4" -> from: "e2", to: "e4")
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        console.log("AI move:", { from, to, move });
        const lastMoveData = { from, to };
        console.log("Setting AI lastMove to:", lastMoveData);
        setAILastMove(lastMoveData);

        // Clear the highlight after 3 seconds
        setTimeout(() => {
          console.log("Clearing aiLastMove after timeout");
          setAILastMove(null);
        }, 3000);

        setGameStatus("AI move completed. Your turn!");
      } catch (error) {
        console.error("Error making AI move:", error);
        setGameStatus("Error making AI move!");
      } finally {
        setIsLoading(false);
        setIsAITurn(false);
      }
    },
    [seed, onGameStateUpdate],
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

  const handleSquareClick = useCallback(
    (square: string) => {
      if (isLoading || isAITurn) return;

      // Check if it's the player's turn
      if (chessTurn !== playerColor) {
        setGameStatus("Not your turn! Wait for AI to move.");
        return;
      }

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

          const newChess = new Chess(chessFen);
          const result = newChess.move(move);

          if (result) {
            setSelectedSquare(null);

            setGameStatus("Your move completed. AI is thinking...");

            // Update URL with new game state - this is the source of truth
            onGameStateUpdate(newChess.fen());

            // Set the last move for highlighting
            const playerLastMoveData = { from: selectedSquare, to: square };
            console.log("Player move:", playerLastMoveData);
            setPlayerLastMove(playerLastMoveData);

            // Clear the highlight after 3 seconds
            setTimeout(() => {
              console.log("Clearing playerLastMove after timeout");
              setPlayerLastMove(null);
            }, 3000);

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
          setInvalidMoveMessage("Invalid move! Please try a different move.");
          // Clear the invalid move message after 3 seconds
          setTimeout(() => setInvalidMoveMessage(null), 3000);
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
      if (!selectedSquare) return false;
      return legalMoves.some(
        (move) => move.from === selectedSquare && move.to === square,
      );
    },
    [legalMoves, selectedSquare],
  );

  const getSquareColor = useCallback((file: number, rank: number) => {
    return (file + rank) % 2 === 0 ? "bg-amber-100" : "bg-amber-800";
  }, []);

  const getSquareHighlight = useCallback(
    (square: string) => {
      console.log(`Checking highlight for square ${square}:`, {
        selectedSquare,
        playerLastMove,
        aiLastMove,
        isLegalMove: isLegalMove(square),
      });

      if (selectedSquare === square) {
        console.log(`Square ${square}: Selected piece - blue border`);
        return "border-4 border-blue-500";
      }

      if (
        playerLastMove &&
        (playerLastMove.from === square || playerLastMove.to === square)
      ) {
        console.log(
          "Highlighting player last move square:",
          square,
          playerLastMove,
        );
        return "!border-4 !border-yellow-500 !bg-yellow-100";
      }

      if (
        aiLastMove &&
        (aiLastMove.from === square || aiLastMove.to === square)
      ) {
        console.log("Highlighting AI last move square:", square, aiLastMove);
        return "!border-4 !border-yellow-500 !bg-yellow-100";
      }

      if (isLegalMove(square)) {
        console.log(`Square ${square}: Legal move - green border`);
        return "border-2 border-green-500";
      }

      console.log(`Square ${square}: No highlight`);
      return "";
    },
    [selectedSquare, isLegalMove, playerLastMove, aiLastMove],
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

        // Debug: Log the highlight for specific squares
        if (highlight) {
          console.log(`Square ${square} highlight: "${highlight}"`);
        }

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

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleResetGame = useCallback(() => {
    // Generate a new random seed
    const newSeed = Math.random().toString(36).substring(2, 15);
    // Navigate to a new game with the new seed
    router.push(`/game/${newSeed}`);
  }, [router]);

  return (
    <div className="flex flex-col items-center">
      {/* Navigation buttons at the top - never change */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={handleResetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Chess board - main content */}
      <div className="grid grid-cols-8 w-96 h-96 border-4 border-gray-800 rounded-lg">
        {memoizedBoard}
      </div>

      {/* Status and info below the board */}
      <div className="mt-4 text-center">
        <div className="text-xl font-semibold mb-2">{getGameStatus()}</div>
        {isLoading && (
          <div className="text-sm text-gray-600">Processing...</div>
        )}
        {invalidMoveMessage && (
          <div className="text-sm text-red-600 font-medium mt-2 bg-red-50 px-4 py-2 rounded-md border border-red-200">
            {invalidMoveMessage}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-1">
          Current turn: {chessTurn === "w" ? "White" : "Black"} | Player color:{" "}
          {playerColor === "w" ? "White" : "Black"}
        </div>
        <div className="text-sm text-gray-600 mt-2">{chessFen}</div>
      </div>
    </div>
  );
}
