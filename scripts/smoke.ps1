$ErrorActionPreference = 'Stop'

function Assert-Response($url, $expectedText) {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -ne 200 -or $response.Content -notmatch [regex]::Escape($expectedText)) {
        throw "Unexpected response from $url"
    }
    Write-Host "OK  $url"
}

$services = docker compose -f "$PSScriptRoot/../docker/compose.yaml" ps --format json | ConvertFrom-Json
foreach ($serviceName in @('database', 'api', 'website')) {
    $service = $services | Where-Object Service -eq $serviceName
    if (-not $service -or $service.State -ne 'running') {
        throw "$serviceName is not running"
    }
    if ($serviceName -ne 'website' -and $service.Health -ne 'healthy') {
        throw "$serviceName is not healthy"
    }
    Write-Host "OK  $serviceName container"
}

Assert-Response 'http://localhost:8080/' '<title>Balinese Retreat</title>'
Assert-Response 'http://localhost:8080/stay.html' 'Room to slow down together.'
Assert-Response 'http://localhost:8080/amenities.html' 'Everything for the stay.'
Assert-Response 'http://localhost:8080/location.html' 'Hills near the city.'
Assert-Response 'http://localhost:8080/availability.html' 'Plan your stay.'
Assert-Response 'http://localhost:8080/calendar.js' 'loadCalendar'
Assert-Response 'http://localhost:8080/guide.html' 'House Guide'
Assert-Response 'http://localhost:8080/script.js' 'loadImages'
foreach ($photo in @('hero-poolside-dining.jpg', 'living-room-and-view.jpg', 'bedroom.jpg', 'stone-bath.jpg', 'pool-and-mountain-view.jpg', 'kitchen.jpg', 'bedroom-two.jpg', 'bedroom-three.jpg', 'theatre-room.jpg', 'view-patio.jpg', 'private-entrance.jpg')) {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/images/$photo" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -ne 200 -or $response.Headers['Content-Type'] -notlike 'image/*') {
        throw "Photo failed to load: $photo"
    }
    Write-Host "OK  image $photo"
}

$health = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -TimeoutSec 10
if ($health.status -ne 'ok') { throw 'API health check failed' }
Write-Host 'OK  API health endpoint'

$imageResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/images' -TimeoutSec 10
if ($null -eq $imageResponse.images) { throw 'Image API response is missing images' }
Write-Host 'OK  image API response'

$calendar = Invoke-RestMethod -Uri 'http://localhost:3001/api/calendar' -TimeoutSec 20
if ($null -eq $calendar.unavailable -or $null -eq $calendar.stale) { throw 'Calendar API response is incomplete' }
Write-Host 'OK  Airbnb calendar feed'

Write-Host 'Smoke checks passed.'
