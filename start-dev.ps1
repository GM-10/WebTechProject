$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend-node'
$frontendPath = Join-Path $root 'frontend'

function Test-PortListening {
    param([int]$Port)

    $match = netstat -ano | Select-String ":$Port\s+.*LISTENING"
    return $null -ne $match
}

function Start-ServiceTerminal {
    param(
        [string]$Name,
        [string]$WorkingDir,
        [string]$Command,
        [int]$Port
    )

    if (-not (Test-Path $WorkingDir)) {
        Write-Host "[ERROR] $Name path missing: $WorkingDir" -ForegroundColor Red
        return
    }

    if (Test-PortListening -Port $Port) {
        Write-Host "[SKIP] $Name already running on port $Port" -ForegroundColor Yellow
        return
    }

    Write-Host "[START] $Name on port $Port" -ForegroundColor Green
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "Set-Location '$WorkingDir'; $Command"
    ) | Out-Null
}

Write-Host 'Launching CampusPlace development services...' -ForegroundColor Cyan

Start-ServiceTerminal -Name 'Backend' -WorkingDir $backendPath -Command 'npm start' -Port 5000
Start-ServiceTerminal -Name 'Frontend' -WorkingDir $frontendPath -Command 'npm run dev' -Port 5175

Write-Host ''
Write-Host 'Done. If a service was already running, it was left untouched.' -ForegroundColor Cyan
Write-Host 'Backend URL:  http://localhost:5000/api/health'
Write-Host 'Frontend URL: http://localhost:5175'
