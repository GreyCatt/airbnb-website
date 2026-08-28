#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
compose_file="$script_dir/compose.yaml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or is not available on PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start Docker Desktop and run this script again." >&2
  exit 1
fi

echo "Building and starting the development containers..."
docker compose -f "$compose_file" up --build -d

echo
echo "Frontend:  http://localhost:8080"
echo "Spring API: http://localhost:3001/api/health"
echo
echo "View logs:  docker compose -f docker/compose.yaml logs -f"
echo "Stop:       docker compose -f docker/compose.yaml down"

docker compose -f "$compose_file" ps
