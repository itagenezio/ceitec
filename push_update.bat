@echo off
echo ==========================================
echo ENVIANDO ATUALIZAÇÃO DO BOTÃO DE INSTALAR
echo ==========================================
echo.
echo 1. Adicionando novo componente de instalacao...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 2. Salvando alteracoes...
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: Adiciona botao flutuante de instalar PWA"
echo.
echo 3. Enviando para o Vercel...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.
echo ==========================================
echo SUCESSO! 
echo Acesse https://ceitec.vercel.app/ em 2 minutos.
echo Um botao "Instalar App" aparecera no canto.
echo ==========================================
pause
