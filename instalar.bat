@echo off
SET "PATH=C:\Program Files\nodejs;%PATH%"
echo Verificando instalacao...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo Erro: Node nao encontrado em C:\Program Files\nodejs
    exit /b 1
)
echo Instalando dependencias (Vite)...
npm install
echo Verificando se o Vite foi instalado...
dir node_modules\vite\bin\vite.js
if %ERRORLEVEL% NEQ 0 (
    echo Erro: O Vite nao foi instalado corretamente.
) else (
    echo Vite instalado com sucesso!
)
pause
