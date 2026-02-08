@echo off
echo ==========================================
echo CORRIGINDO PUSH PARA GIT - CEITEC EVENTOS
echo ==========================================
echo.
echo 1. Verificando branch atual...
"C:\Program Files\Git\cmd\git.exe" branch
echo.
echo 2. Garantindo que estamos na branch main...
"C:\Program Files\Git\cmd\git.exe" branch -m master main 2>nul
echo.
echo 3. Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 4. Commitando mudancas locais...
"C:\Program Files\Git\cmd\git.exe" commit -m "Correcao de sync e upload manual" 2>nul
echo.
echo 5. Tentando puxar alteracoes remotas (merge)...
"C:\Program Files\Git\cmd\git.exe" pull origin main --allow-unrelated-histories --no-edit
echo.
echo 6. Enviando para o GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ==========================================
echo PROCESSO FINALIZADO
echo Se houve erro acima, verifique sua internet ou senha.
echo ==========================================
pause
