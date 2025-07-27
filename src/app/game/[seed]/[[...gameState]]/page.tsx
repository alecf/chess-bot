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
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom right, var(--background), var(--background))",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            style={{
              backgroundColor: "var(--accent-blue)",
            }}
          ></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
            style={{
              backgroundColor: "var(--accent-purple)",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
          <div
            className="backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <h1
              className="text-3xl font-bold text-center mb-6"
              style={{
                background:
                  "linear-gradient(to right, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choose Your Color
            </h1>
            <ColorSelection onColorSelect={handleColorSelection} />
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm hover:underline"
                style={{ color: "var(--accent-blue)" }}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, var(--background), var(--background))",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{
            backgroundColor: "var(--accent-blue)",
          }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          style={{
            backgroundColor: "var(--accent-purple)",
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-4">
            <button
              onClick={() => router.push("/")}
              className="text-sm flex items-center gap-1 hover:underline"
              style={{ color: "var(--accent-blue)" }}
            >
              ← Back to Home
            </button>
          </div>

          <div className="text-center mb-6">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(to right, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Chess Game
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Playing as {playerColor === "w" ? "White" : "Black"}
            </p>
          </div>

          <div
            className="backdrop-blur-sm rounded-2xl shadow-xl p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <ChessBoard
              seed={seed}
              playerColor={playerColor!}
              gameState={parsedBoardState?.fen}
              onGameStateUpdate={updateGameState}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
