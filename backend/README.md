# Chess Bot Backend

A FastAPI-based backend for a chess bot that generates moves for chess positions.

## Features

- FastAPI web framework
- Python 3.13.3
- Chess move generation using python-chess
- RESTful API endpoints
- Comprehensive testing setup
- Code quality tools (Ruff for linting and formatting)

## Development Setup

### Prerequisites

- Python 3.13.3 or higher
- uv (Python package manager)

### Installation

1. Clone the repository and navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   uv sync
   ```

3. Install development dependencies:
   ```bash
   uv sync --extra dev
   ```

### Running the Application

#### Development Server

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Production Server

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

### API Endpoints

- `GET /` - Health check and API status
- `GET /health` - Health check endpoint
- `GET /new-game` - Get initial board state for a new game
- `POST /move` - Generate next move for a given chess position

### Development Tools

#### Code Formatting and Linting

```bash
# Format code with Ruff
uv run ruff format .

# Check formatting without making changes
uv run ruff format --check .

# Run Ruff linter
uv run ruff check .

# Fix auto-fixable issues
uv run ruff check . --fix
```

#### Testing

```bash
# Run all tests
uv run pytest

# Run tests with verbose output
uv run pytest -v
```

#### Pre-commit Hooks

```bash
# Install pre-commit hooks
uv run pre-commit install

# Run pre-commit hooks manually
uv run pre-commit run --all-files
```

### VS Code Configuration

The project includes VS Code configuration files:

- `.vscode/extensions.json` - Recommended extensions
- `.vscode/settings.json` - Python development settings
- `.vscode/launch.json` - Debug configurations

### Project Structure

```
backend/
├── main.py              # FastAPI application
├── test_main.py         # Test suite
├── pyproject.toml       # Project configuration and dependencies
├── uv.lock             # Locked dependencies
├── .python-version     # Python version specification
├── ruff.toml           # Ruff configuration (linting + formatting)
└── README.md           # This file
```

### Code Quality

The project uses Ruff for code quality:

- **Ruff** - Fast Python linter and formatter (replaces Black, Flake8, isort, etc.)
- **Pytest** - Testing framework
- **Pre-commit** - Git hooks for code quality

### Contributing

1. Install development dependencies: `uv sync --extra dev`
2. Run tests: `uv run pytest`
3. Format code: `uv run ruff format .`
4. Check linting: `uv run ruff check .`

### License

This project is part of the Chess Bot application.
