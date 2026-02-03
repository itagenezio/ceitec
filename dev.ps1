# Script de diagnóstico e inicialização
$ErrorActionPreference = "Continue"
$env:Path += ";C:\Program Files\nodejs"

Write-Host "=== Diagnóstico do Ambiente ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version 2>&1
    Write-Host "Node.js versão: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao verificar Node.js: $_" -ForegroundColor Red
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version 2>&1
    Write-Host "npm versão: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao verificar npm: $_" -ForegroundColor Red
}

# Verificar se Vite está instalado
Write-Host "Verificando Vite..." -ForegroundColor Yellow
if (Test-Path ".\node_modules\vite\bin\vite.js") {
    Write-Host "Vite encontrado!" -ForegroundColor Green
}
else {
    Write-Host "Vite NÃO encontrado! Instalando dependências..." -ForegroundColor Red
    & "C:\Program Files\nodejs\npm.cmd" install
}

Write-Host ""
Write-Host "=== Iniciando Servidor de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar Vite
& "C:\Program Files\nodejs\node.exe" ".\node_modules\vite\bin\vite.js"
