"use client";

import ChessBoard from "@/components/ChessBoard";
import ColorSelection from "@/components/ColorSelection";
import {
  getInitialBoardState,
  parseBoardState,
  serializeBoardState,
  type BoardState,
} from "@/utils/boardState";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seed = params.seed as string;
  const encodedGameState = searchParams.get("state");

  // Decode URI and parse the board state
  const decodedGameState = encodedGameState
    ? decodeURIComponent(encodedGameState)
    : undefined;
  const parsedBoardState = parseBoardState(decodedGameState);

  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(
    parsedBoardState?.playerColor || null,
  );
  const [isGameStarted, setIsGameStarted] = useState(!!parsedBoardState);

  // Update URL when game state changes
  const updateGameState = (newFen: string) => {
    if (!playerColor) return;

    const boardState: BoardState = {
      playerColor,
      fen: newFen,
    };

    const serializedState = serializeBoardState(boardState);
    const encodedGameState = encodeURIComponent(serializedState);
    const newPath = `/game/${seed}?state=${encodedGameState}`;
    router.push(newPath);
  };

  const handleColorSelection = (color: "w" | "b") => {
    setPlayerColor(color);
    setIsGameStarted(true);

    // Set initial game state with player color
    const boardState = getInitialBoardState(color);
    const serializedState = serializeBoardState(boardState);
    const encodedGameState = encodeURIComponent(serializedState);
    const newPath = `/game/${seed}?state=${encodedGameState}`;
    router.push(newPath);

    // If player chooses black, AI goes first
    if (color === "b") {
      // AI goes first, so we need to make an initial API call
      // This will be handled in the ChessBoard component
    }
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Choose Your Color
          </h1>
          <ColorSelection onColorSelect={handleColorSelection} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">
          Chess Game - {playerColor === "w" ? "White" : "Black"} Player
        </h1>
        <ChessBoard
          seed={seed}
          playerColor={playerColor!}
          gameState={parsedBoardState?.fen}
          onGameStateUpdate={updateGameState}
        />
      </div>
    </div>
  );
}
