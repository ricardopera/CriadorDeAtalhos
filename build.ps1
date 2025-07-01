# Criador de Atalhos - Build Script (PowerShell)
# Execute este script em um terminal PowerShell

Write-Host "========================================" -ForegroundColor Green
Write-Host "Criador de Atalhos - Build Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar se o .NET SDK está instalado
Write-Host "Verificando se o .NET 6.0 SDK está instalado..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host ".NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: .NET 6.0 SDK não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o .NET 6.0 SDK do site oficial da Microsoft." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Restaurar dependências
Write-Host "Restaurando dependências..." -ForegroundColor Yellow
try {
    dotnet restore
    if ($LASTEXITCODE -ne 0) { throw "Falha ao restaurar dependências" }
    Write-Host "Dependências restauradas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Compilar
Write-Host "Compilando em modo Release..." -ForegroundColor Yellow
try {
    dotnet build --configuration Release --no-restore
    if ($LASTEXITCODE -ne 0) { throw "Falha na compilação" }
    Write-Host "Compilação concluída com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Criar executável autocontido de arquivo único
Write-Host "Criando executável autocontido de arquivo único..." -ForegroundColor Yellow
try {
    if (Test-Path "./publish") {
        Remove-Item "./publish" -Recurse -Force
    }
    
    dotnet publish --configuration Release --self-contained true --runtime win-x64 --property:PublishSingleFile=true --output ./publish/win-x64
    if ($LASTEXITCODE -ne 0) { throw "Falha ao criar executável autocontido de arquivo único" }
    Write-Host "Executável autocontido de arquivo único criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Criar informações de versão
Write-Host "Criando informações de versão..." -ForegroundColor Yellow
try {
    $versionInfo = @"
Version: 1.0.3
Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Commit: $(git rev-parse HEAD 2>$null)
"@
    $versionInfo | Out-File -FilePath "./publish/win-x64/version.txt" -Encoding UTF8
    Write-Host "Informações de versão criadas!" -ForegroundColor Green
} catch {
    Write-Host "AVISO: Falha ao criar informações de versão" -ForegroundColor Yellow
}

Write-Host ""

# Criar arquivo ZIP
Write-Host "Criando arquivo ZIP..." -ForegroundColor Yellow
try {
    $zipPath = "./CriadorDeAtalhos-v1.0.3-win-x64.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path "./publish/win-x64/*" -DestinationPath $zipPath
    Write-Host "Arquivo ZIP criado: $zipPath" -ForegroundColor Green
} catch {
    Write-Host "AVISO: Falha ao criar arquivo ZIP. Executável criado em ./publish/win-x64/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Executável criado em: ./publish/win-x64/CriadorDeAtalhos.exe" -ForegroundColor Cyan
Write-Host "Arquivo ZIP: ./CriadorDeAtalhos-v1.0.3-win-x64.zip" -ForegroundColor Cyan
Write-Host ""

$answer = Read-Host "Deseja abrir a pasta do executável? (s/n)"
if ($answer -eq "s" -or $answer -eq "S") {
    Start-Process -FilePath "explorer.exe" -ArgumentList "./publish/win-x64"
}

Read-Host "Pressione Enter para sair"