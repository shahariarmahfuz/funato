#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Python FastAPI Backend on http://localhost:8000 ..."
(cd "$ROOT_DIR/backend" && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

echo "Starting Next.js 16 Frontend on http://localhost:3000 ..."
(cd "$ROOT_DIR/frontend" && npm run dev -- --port 3000) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT
wait
