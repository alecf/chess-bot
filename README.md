# Chess Bot

A chess-playing application with a Next.js frontend and Python backend. The frontend maintains the game state while the backend provides move generation through a REST API.

## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: FastAPI Python server with chess move generation
- **Future AI**: Neural network trained with Gymnasium and PyTorch

## Project Structure

```
chess-bot/
├── src/                    # Next.js frontend
│   └── app/               # App router pages
├── backend/               # Python FastAPI server
│   ├── main.py           # API server
│   ├── pyproject.toml    # Python dependencies
│   └── README.md         # Backend documentation
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## Quick Start

### Frontend (Next.js)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (Python)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install uv (if not already installed):

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. Install dependencies:

   ```bash
   uv sync
   ```

4. Start the API server:

   ```bash
   uv run python main.py
   ```

5. The API will be available at [http://localhost:8000](http://localhost:8000)

### Development Scripts

For convenience, you can use these npm scripts:

- `npm run dev:full` - Start both frontend and backend servers
- `npm run backend` - Start only the backend server
- `npm run backend:dev` - Start backend with auto-reload

## API Documentation

Once the backend is running, view the interactive API documentation:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Current Features

- **Frontend**: Welcome page with project overview
- **Backend**:
  - Random move generation (placeholder for AI)
  - FEN-based board state input
  - Legal move validation
  - UCI and SAN move notation support

## Future Development

- [ ] Chess board UI component
- [ ] Game state management in frontend
- [ ] Neural network integration for move generation
- [ ] Training pipeline with Gymnasium and PyTorch
- [ ] Move history and game replay
- [ ] Multiple AI difficulty levels

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, python-chess
- **Package Management**: npm (frontend), uv (backend)
