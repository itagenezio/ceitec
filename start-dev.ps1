# Script para iniciar o servidor Vite
$env:Path += ";C:\Program Files\nodejs"
$env:FORCE_COLOR = "1"

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Aguarde..." -ForegroundColor Yellow

& "C:\Program Files\nodejs\node.exe" ".\node_modules\vite\bin\vite.js"
