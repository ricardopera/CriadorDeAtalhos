@echo off
echo.
echo ============================================
echo    Criador de Atalhos - Versao Web
echo ============================================
echo.
echo Verificando dependencias...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao esta instalado ou nao esta no PATH.
    echo Baixe Python em: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Verificar se pip está disponível
pip --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: pip nao esta disponivel.
    echo.
    pause
    exit /b 1
)

echo Instalando dependencias necessarias...
echo.
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao instalar dependencias.
    echo Verifique sua conexao com a internet e tente novamente.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Iniciando aplicacao web...
echo ============================================
echo.
echo O navegador sera aberto automaticamente.
echo Se nao abrir, acesse: http://localhost:5000
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

REM Iniciar aplicação web
python web_app.py

echo.
echo Aplicacao encerrada.
pause