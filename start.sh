#!/usr/bin/env bash
# ConstellAI — Start both servers in development mode.
# Usage: cd ConstellAI && bash start.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▲ Starting FastAPI backend on :8000 ..."
"$ROOT/.venv/bin/uvicorn" backend.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "▲ Starting Next.js frontend on :3000 ..."
cd "$ROOT/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Backend  → http://localhost:8000/api/graph"
echo "  Frontend → http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
