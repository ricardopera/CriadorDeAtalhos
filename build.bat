@echo off
echo ========================================
echo Criador de Atalhos - Build Script
echo ========================================

echo.
echo Verificando se o .NET 6.0 SDK está instalado...
dotnet --version > nul 2>&1
if errorlevel 1 (
    echo ERRO: .NET 6.0 SDK não encontrado!
    echo Por favor, instale o .NET 6.0 SDK do site oficial da Microsoft.
    pause
    exit /b 1
)

echo .NET SDK encontrado!
echo.

echo Restaurando dependências...
dotnet restore
if errorlevel 1 (
    echo ERRO: Falha ao restaurar dependências!
    pause
    exit /b 1
)

echo.
echo Compilando em modo Release...
dotnet build --configuration Release --no-restore
if errorlevel 1 (
    echo ERRO: Falha na compilação!
    pause
    exit /b 1
)

echo.
echo Criando executável autocontido...
if exist "./publish" rmdir /s /q "./publish"
dotnet publish --configuration Release --self-contained true --runtime win-x64 --output ./publish/win-x64
if errorlevel 1 (
    echo ERRO: Falha ao criar executável autocontido!
    pause
    exit /b 1
)

echo.
echo Criando informações de versão...
echo Version: 1.0.2 > "./publish/win-x64/version.txt"
echo Build Date: %date% %time% >> "./publish/win-x64/version.txt"
for /f "tokens=*" %%i in ('git rev-parse HEAD 2^>nul') do echo Commit: %%i >> "./publish/win-x64/version.txt"

echo.
echo Criando arquivo ZIP...
powershell -Command "Compress-Archive -Path './publish/win-x64/*' -DestinationPath './CriadorDeAtalhos-v1.0.2-win-x64.zip' -Force"
if errorlevel 1 (
    echo AVISO: Falha ao criar arquivo ZIP. Executável criado em ./publish/win-x64/
) else (
    echo Arquivo ZIP criado: CriadorDeAtalhos-v1.0.2-win-x64.zip
)

echo.
echo ========================================
echo BUILD CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Executável criado em: ./publish/win-x64/CriadorDeAtalhos.exe
echo Arquivo ZIP: ./CriadorDeAtalhos-v1.0.2-win-x64.zip
echo.

set /p answer="Deseja abrir a pasta do executável? (s/n): "
if /i "%answer%"=="s" (
    explorer "./publish/win-x64"
)

echo.
echo Pressione qualquer tecla para sair...
pause > nul