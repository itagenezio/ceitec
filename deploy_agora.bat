
@echo off
echo ==========================================
echo INICIANDO DEPLOY MANUAL - CEITEC EVENTOS
echo ==========================================
echo.
echo 1. Verificando Git...
"C:\Program Files\Git\cmd\git.exe" --version

echo.
echo 2. Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .

echo.
echo 3. Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Deploy via script BAT" --allow-empty

echo.
echo 4. Enviando para o GitHub (aguarde)...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.

echo ==========================================
echo PROCESSO FINALIZADO
echo Se nao apareceu erro acima, o Vercel deve atualizar em 2 minutos.
echo ==========================================
pause
