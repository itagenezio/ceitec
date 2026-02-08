@echo off
echo ==========================================
echo ENVIANDO ATUALIZAÇÃO PWA (INSTALADOR)
echo ==========================================
echo.
echo 1. Adicionando suporte a Instalacao (PWA)...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 2. Salvando alteracoes...
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: Adiciona PWA para instalacao em notebooks e celulares"
echo.
echo 3. Enviando para o GitHub/Vercel...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.
echo ==========================================
echo SUCESSO! O aplicativo agora e instalavel.
echo Aguarde o Vercel finalizar o deploy.
echo ==========================================
pause
