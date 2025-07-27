.PHONY: help install install-dev test format lint clean run-dev run-prod check-all

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install production dependencies
	cd backend && uv sync

install-dev: ## Install development dependencies
	cd backend && uv sync --extra dev

test: ## Run tests
	cd backend && uv run pytest -v

format: ## Format code with Ruff
	cd backend && uv run ruff format .

lint: ## Run linting with Ruff
	cd backend && uv run ruff check .

lint-fix: ## Fix linting issues with Ruff
	cd backend && uv run ruff check . --fix

check-all: ## Run all quality checks
	cd backend && uv run pytest && uv run ruff format --check . && uv run ruff check .

run-dev: ## Run development server
	cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

run-prod: ## Run production server
	cd backend && uv run uvicorn main:app --host 0.0.0.0 --port 8000

clean: ## Clean up Python cache files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
