"""Tests for the chess bot API."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chess Bot API is running!"}


def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_new_game():
    """Test the new game endpoint."""
    response = client.get("/new-game")
    assert response.status_code == 200
    data = response.json()
    assert "fen" in data
    assert "turn" in data
    assert "castling_rights" in data
    assert data["turn"] == "white"


def test_get_next_move_valid_fen():
    """Test getting next move with valid FEN."""
    response = client.post(
        "/move",
        json={"fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "move" in data
    assert "san" in data
    assert "piece" in data


def test_get_next_move_invalid_fen():
    """Test getting next move with invalid FEN."""
    response = client.post("/move", json={"fen": "invalid_fen"})
    assert response.status_code == 400
    assert "Invalid FEN string" in response.json()["detail"]


def test_get_next_move_game_over():
    """Test getting next move when game is over."""
    # FEN for a position where the game is over (checkmate)
    # This is a simple checkmate position
    checkmate_fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
    response = client.post("/move", json={"fen": checkmate_fen})
    assert response.status_code == 400
    assert "Game is already over" in response.json()["detail"]
