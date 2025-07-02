@echo off
echo ========================================
echo Criador de Atalhos - Build Script Python
echo ========================================

echo.
echo Verificando se o Python está instalado...
python --version > nul 2>&1
if errorlevel 1 (
    echo ERRO: Python não encontrado!
    echo Por favor, instale o Python 3.8+ do site oficial.
    pause
    exit /b 1
)

echo Python encontrado!
echo.

echo Verificando se o PyInstaller está instalado...
pyinstaller --version > nul 2>&1
if errorlevel 1 (
    echo PyInstaller não encontrado. Tentando instalar...
    pip install pyinstaller
    if errorlevel 1 (
        echo ERRO: Falha ao instalar PyInstaller!
        pause
        exit /b 1
    )
)

echo.
echo Instalando dependências...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências!
    pause
    exit /b 1
)

echo.
echo Criando executável autocontido...
if exist "dist" rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"

echo Preparando arquivos para o build...
mkdir build
copy favicon.ico build\

pyinstaller --onefile --windowed --name "CriadorDeAtalhos" ^
    --icon="favicon.ico" ^
    --add-data "favicon.ico;." ^
    --distpath "./publish/python-win-x64" ^
    --workpath "./build" ^
    --specpath "./build" ^
    criador_atalhos.py

if errorlevel 1 (
    echo ERRO: Falha ao criar executável!
    pause
    exit /b 1
)

echo.
echo Criando informações de versão...
echo Version: 1.0.3-py > "./publish/python-win-x64/version.txt"
echo Build Date: %date% %time% >> "./publish/python-win-x64/version.txt"
for /f "tokens=*" %%i in ('git rev-parse HEAD 2^>nul') do echo Commit: %%i >> "./publish/python-win-x64/version.txt"
echo Python Implementation >> "./publish/python-win-x64/version.txt"

echo.
echo Criando arquivo ZIP...
powershell -Command "Compress-Archive -Path './publish/python-win-x64/*' -DestinationPath './CriadorDeAtalhos-v1.0.3-py-win-x64.zip' -Force"
if errorlevel 1 (
    echo AVISO: Falha ao criar arquivo ZIP. Executável criado em ./publish/python-win-x64/
) else (
    echo Arquivo ZIP criado: CriadorDeAtalhos-v1.0.3-py-win-x64.zip
)

echo.
echo ========================================
echo BUILD CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Executável criado em: ./publish/python-win-x64/CriadorDeAtalhos.exe
echo Arquivo ZIP: ./CriadorDeAtalhos-v1.0.3-py-win-x64.zip
echo.

echo Verificando tamanho do executável...
dir "./publish/python-win-x64/CriadorDeAtalhos.exe" | findstr "CriadorDeAtalhos.exe"

set /p answer="Deseja abrir a pasta do executável? (s/n): "
if /i "%answer%"=="s" (
    explorer "./publish/python-win-x64"
)

echo.
echo Pressione qualquer tecla para sair...
pause > nul