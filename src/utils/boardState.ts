export interface BoardState {
  playerColor: "w" | "b";
  fen: string;
}

// Parse the game state from raw string segments
export const parseBoardState = (
  gameStateString: string | undefined,
): BoardState | null => {
  if (!gameStateString) return null;

  try {
    const segments = gameStateString.split(":");

    if (segments.length !== 2) return null;

    const [playerColor, fen] = segments;

    if (playerColor !== "w" && playerColor !== "b") return null;

    return { playerColor, fen };
  } catch (error) {
    console.error("Failed to parse board state:", error);
    return null;
  }
};

// Serialize the board state to raw string
export const serializeBoardState = (boardState: BoardState): string => {
  const { playerColor, fen } = boardState;
  return `${playerColor}:${fen}`;
};

// Get the initial board state for a given player color
export const getInitialBoardState = (playerColor: "w" | "b"): BoardState => {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  return {
    playerColor,
    fen: initialFen,
  };
};

// Check if a board state represents the initial position
export const isInitialPosition = (fen: string): boolean => {
  return fen === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
};
