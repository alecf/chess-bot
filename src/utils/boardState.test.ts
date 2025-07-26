import {
  getInitialBoardState,
  isInitialPosition,
  parseBoardState,
  serializeBoardState,
} from "./boardState";

// Simple test to verify board state management
const testBoardStateManagement = () => {
  console.log("Testing board state management...");

  // Test 1: Create initial board state
  const whiteBoardState = getInitialBoardState("w");
  console.log("White initial board state:", whiteBoardState);

  // Test 2: Serialize board state (raw string, no URI encoding)
  const serialized = serializeBoardState(whiteBoardState);
  console.log("Serialized board state (raw):", serialized);

  // Test 3: Parse board state (raw string, no URI decoding)
  const parsed = parseBoardState(serialized);
  console.log("Parsed board state:", parsed);

  // Test 4: Check initial position
  const isInitial = isInitialPosition(whiteBoardState.fen);
  console.log("Is initial position:", isInitial);

  // Test 5: Round trip test (raw string)
  const roundTrip = parseBoardState(serializeBoardState(whiteBoardState));
  console.log("Round trip test:", roundTrip);

  // Test 6: URI encoding/decoding (simulating page component behavior)
  const uriEncoded = encodeURIComponent(serialized);
  console.log("URI encoded:", uriEncoded);
  const uriDecoded = decodeURIComponent(uriEncoded);
  console.log("URI decoded:", uriDecoded);
  const uriRoundTrip = parseBoardState(uriDecoded);
  console.log("URI round trip test:", uriRoundTrip);

  // Verify all tests pass
  const testsPassed =
    parsed?.playerColor === "w" &&
    parsed?.fen === whiteBoardState.fen &&
    isInitial === true &&
    roundTrip?.playerColor === "w" &&
    roundTrip?.fen === whiteBoardState.fen &&
    uriRoundTrip?.playerColor === "w" &&
    uriRoundTrip?.fen === whiteBoardState.fen;

  console.log("All tests passed:", testsPassed);

  return testsPassed;
};

// Export for potential use in development
export { testBoardStateManagement };
