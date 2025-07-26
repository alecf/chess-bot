"use client";

import ChessBoard from "@/components/ChessBoard";
import ColorSelection from "@/components/ColorSelection";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const seed = params.seed as string;
  const gameState = params.gameState
    ? ((Array.isArray(params.gameState)
        ? params.gameState[0]
        : params.gameState) as string)
    : undefined;

  // Decode the game state if it exists
  const decodedGameState = gameState
    ? decodeURIComponent(gameState)
    : undefined;

  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Update URL when game state changes
  const updateGameState = (newGameState: string) => {
    const encodedGameState = encodeURIComponent(newGameState);
    const newPath = `/game/${seed}/${encodedGameState}`;
    router.push(newPath);
  };

  const handleColorSelection = (color: "w" | "b") => {
    setPlayerColor(color);
    setIsGameStarted(true);

    // If player chooses white, they go first (no initial AI move)
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
          gameState={decodedGameState}
          onGameStateUpdate={updateGameState}
        />
      </div>
    </div>
  );
}
