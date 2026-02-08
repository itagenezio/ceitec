@echo off
echo ==========================================
echo CORRIGINDO GUI DE INSTALACAO IOS
echo ==========================================
echo.
echo 1. Adicionando setas indicativas...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 2. Salvando mudancas...
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: Melhoria visual nas instrucoes iOS"
echo.
echo 3. Atualizando Vercel...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.
echo ==========================================
echo PRONTO!
echo Agora as setas indicarao onde clicar no iPhone.
echo ==========================================
pause
