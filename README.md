# Chess Bot

A chess game with AI opponent built with Next.js frontend and FastAPI backend.

## Features

- **Interactive Chess Board**: Play chess against an AI opponent
- **Color Selection**: Choose to play as white or black pieces
- **URL State Management**: Game state is preserved in the URL for sharing and navigation
- **Real-time AI Moves**: AI responds to your moves using a neural network backend
- **Legal Move Validation**: Only legal chess moves are allowed
- **Visual Feedback**: Selected pieces and legal moves are highlighted

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- uv (Python package manager)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chess-bot
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
uv sync
cd ..
```

### Running the Application

1. Start the backend server:

```bash
npm run backend:dev
```

2. In a new terminal, start the frontend:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## How to Play

1. **Start a Game**: Click the "Start Game" button on the homepage
2. **Choose Your Color**: Select whether you want to play as white or black
   - White goes first
   - Black allows the AI to make the first move
3. **Make Moves**:
   - Click on one of your pieces to select it
   - Click on a legal destination square to move
   - Click on the same piece again to deselect it
   - Click on another of your pieces to select a different piece
4. **Game State**: The URL updates with each move, allowing you to share game positions

## Project Structure

```
chess-bot/
├── src/
│   ├── app/
│   │   ├── api/move/          # API route for AI moves
│   │   ├── game/[seed]/       # Dynamic game routes
│   │   └── page.tsx           # Homepage
│   └── components/
│       ├── ChessBoard.tsx     # Main chess game component
│       ├── ChessSquare.tsx    # Individual square component
│       └── ColorSelection.tsx # Color selection UI
├── backend/
│   └── main.py               # FastAPI backend with AI
└── package.json
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Chess Logic**: chess.js library
- **Icons**: Lucide React
- **Backend**: FastAPI, Python
- **AI**: Neural network with PyTorch

## API Endpoints

- `POST /api/move`: Sends game state to backend AI and returns the AI's move
  - Request body: `{ fen: string, seed: string }`
  - Response: `{ move: string }`

## Development

- `npm run dev`: Start frontend development server
- `npm run backend:dev`: Start backend development server
- `npm run dev:full`: Start both frontend and backend
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
