@echo off
echo ==========================================
echo CORRIGINDO PWA PARA IPHONE (FINAL)
echo ==========================================
echo.
echo 1. Atualizando meta tags e interface...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 2. Salvando mudancas...
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: Melhoria na deteccao e layout iOS"
echo.
echo 3. Atualizando Vercel...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.
echo ==========================================
echo PRONTO!
echo Se o iPhone ainda der tela branca, peca para
echo o usuario limpar o historico do Safari.
echo ==========================================
pause
