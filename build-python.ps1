Write-Host "========================================" -ForegroundColor Green
Write-Host "Criador de Atalhos - Build Script Python" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green

Write-Host ""

# Verificar Python
Write-Host "Verificando se o Python está instalado..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Python não encontrado" }
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Python não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Python 3.8+ do site oficial." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Verificar PyInstaller
Write-Host "Verificando se o PyInstaller está instalado..." -ForegroundColor Yellow
try {
    $pyinstallerVersion = pyinstaller --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "PyInstaller não encontrado. Tentando instalar..." -ForegroundColor Yellow
        pip install pyinstaller
        if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar PyInstaller" }
    }
    Write-Host "PyInstaller disponível!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar dependências" }
    Write-Host "Dependências instaladas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Criar executável
Write-Host "Criando executável autocontido..." -ForegroundColor Yellow
try {
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
    }
    if (Test-Path "build") {
        Remove-Item "build" -Recurse -Force
    }
    if (Test-Path "./publish/python-win-x64") {
        Remove-Item "./publish/python-win-x64" -Recurse -Force
    }
    
    & pyinstaller --onefile --windowed --name "CriadorDeAtalhos" `
        --icon="favicon.ico" `
        --add-data "favicon.ico;." `
        --distpath "./publish/python-win-x64" `
        --workpath "./build" `
        --specpath "./build" `
        criador_atalhos.py
        
    if ($LASTEXITCODE -ne 0) { throw "Falha ao criar executável" }
    Write-Host "Executável criado com sucesso!" -ForegroundColor Green
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
Version: 1.0.3-py
Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Commit: $(git rev-parse HEAD 2>$null)
Python Implementation
"@
    $versionInfo | Out-File -FilePath "./publish/python-win-x64/version.txt" -Encoding UTF8
    Write-Host "Informações de versão criadas!" -ForegroundColor Green
} catch {
    Write-Host "AVISO: Falha ao criar informações de versão" -ForegroundColor Yellow
}

Write-Host ""

# Verificar tamanho
Write-Host "Verificando tamanho do executável..." -ForegroundColor Yellow
if (Test-Path "./publish/python-win-x64/CriadorDeAtalhos.exe") {
    $fileSize = (Get-Item "./publish/python-win-x64/CriadorDeAtalhos.exe").Length
    $fileSizeMB = [Math]::Round($fileSize / 1MB, 2)
    Write-Host "Tamanho do executável: $fileSizeMB MB" -ForegroundColor Green
}

# Criar arquivo ZIP
Write-Host "Criando arquivo ZIP..." -ForegroundColor Yellow
try {
    $zipPath = "./CriadorDeAtalhos-v1.0.3-py-win-x64.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path "./publish/python-win-x64/*" -DestinationPath $zipPath
    Write-Host "Arquivo ZIP criado: $zipPath" -ForegroundColor Green
} catch {
    Write-Host "AVISO: Falha ao criar arquivo ZIP. Executável criado em ./publish/python-win-x64/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Executável criado em: ./publish/python-win-x64/CriadorDeAtalhos.exe" -ForegroundColor White
Write-Host "Arquivo ZIP: ./CriadorDeAtalhos-v1.0.3-py-win-x64.zip" -ForegroundColor White
Write-Host ""

$openFolder = Read-Host "Deseja abrir a pasta do executável? (s/n)"
if ($openFolder.ToLower() -eq "s") {
    explorer "./publish/python-win-x64"
}

Write-Host ""
Read-Host "Pressione Enter para sair"