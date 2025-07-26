import random
from typing import Optional

import chess
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Chess Bot API", description="API for chess move generation")


class ChessState(BaseModel):
    """Represents the current state of a chess game"""

    fen: str  # Forsyth-Edwards Notation for board state
    # We can extend this later with additional game state like castling rights, en passant, etc.


class MoveResponse(BaseModel):
    """Response containing the next move"""

    move: str  # UCI format move (e.g., "e2e4")
    san: str  # Standard Algebraic Notation (e.g., "e4")
    piece: str  # Piece that was moved (e.g., "P" for pawn)


@app.get("/")
async def root():
    return {"message": "Chess Bot API is running!"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/move", response_model=MoveResponse)
async def get_next_move(chess_state: ChessState):
    """
    Generate the next move for the given chess position.

    Args:
        chess_state: Current chess game state in FEN notation

    Returns:
        MoveResponse: The next move to play
    """
    try:
        # Create a chess board from the FEN string
        board = chess.Board(chess_state.fen)

        # Check if the game is over
        if board.is_game_over():
            raise HTTPException(status_code=400, detail="Game is already over")

        # Get all legal moves
        legal_moves = list(board.legal_moves)

        if not legal_moves:
            raise HTTPException(status_code=400, detail="No legal moves available")

        # For now, just pick a random legal move
        # Later this will be replaced with neural network evaluation
        chosen_move = random.choice(legal_moves)

        # Get the piece that was moved
        piece_symbol = board.piece_at(chosen_move.from_square)
        piece_name = piece_symbol.symbol().upper() if piece_symbol else "P"

        # Convert to SAN for display
        san_move = board.san(chosen_move)

        return MoveResponse(move=chosen_move.uci(), san=san_move, piece=piece_name)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid FEN string: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing move: {str(e)}")


@app.get("/new-game")
async def new_game():
    """
    Get the initial board state for a new game.

    Returns:
        dict: Initial FEN string and other game info
    """
    board = chess.Board()
    return {
        "fen": board.fen(),
        "turn": "white" if board.turn else "black",
        "castling_rights": board.castling_rights,
        "en_passant": str(board.ep_square) if board.ep_square else None,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
