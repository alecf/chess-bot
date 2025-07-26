# Chess Bot Backend

A FastAPI-based chess engine that generates moves for a chess game.

## Setup

This project uses `uv` for Python package management. Make sure you have `uv` installed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then install dependencies:

```bash
uv sync
```

## Running the Server

Start the development server:

```bash
uv run python main.py
```

Or use uvicorn directly:

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can view the interactive API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### GET /

Health check endpoint.

### GET /health

Health check endpoint.

### GET /new-game

Get the initial board state for a new game.

### POST /move

Generate the next move for the given chess position.

**Request Body:**

```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
}
```

**Response:**

```json
{
  "move": "e2e4",
  "san": "e4",
  "piece": "P"
}
```

## Current Implementation

The current implementation uses a simple random move generator. Future versions will integrate with a neural network trained using Gymnasium and PyTorch for more sophisticated move selection.
