$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
Write-Host 'Checking development prerequisites...'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker is not installed or is not available on PATH.'
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Desktop is not running. Start Docker Desktop and run this script again.'
}

Write-Host 'Building and starting all development containers...'
docker compose --project-directory $projectRoot up --build -d
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Compose could not start the development services.'
}

Write-Host ''
Write-Host 'Frontend:  http://localhost:8080'
Write-Host 'Spring API: http://localhost:3001/api/health'
Write-Host ''
Write-Host 'All services are running in Docker.'
Write-Host 'View logs with: docker compose logs -f'
Write-Host 'Stop everything with: docker compose down'

docker compose --project-directory $projectRoot ps
