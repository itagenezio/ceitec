@echo off
echo ==========================================
echo ENVIANDO SUPORTE PARA IPHONE (IOS)
echo ==========================================
echo.
echo 1. Adicionando instrucoes de instalacao para iOS...
"C:\Program Files\Git\cmd\git.exe" add .
echo.
echo 2. Salvando alteracoes...
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: Adiciona suporte e instrucoes passo-a-passo para iPhone"
echo.
echo 3. Atualizando sistema no Vercel...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.
echo ==========================================
echo SUCESSO! 
echo Agora o iPhone tambem mostrara o botao de instalar
echo com as instrucoes corretas.
echo AGUARDE 2 MINUTOS PARA TESTAR.
echo ==========================================
pause
