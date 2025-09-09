#!/usr/bin/env pwsh

Write-Host ""
Write-Host "============================================"
Write-Host "   Criador de Atalhos - Versão Web"
Write-Host "============================================"
Write-Host ""
Write-Host "Verificando dependências..."
Write-Host ""

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python encontrado: $pythonVersion"
} catch {
    Write-Host "❌ ERRO: Python não está instalado ou não está no PATH." -ForegroundColor Red
    Write-Host "Baixe Python em: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se pip está disponível
try {
    $pipVersion = pip --version 2>$null
    Write-Host "✅ pip encontrado"
} catch {
    Write-Host "❌ ERRO: pip não está disponível." -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Instalando dependências necessárias..."
Write-Host ""

# Instalar dependências
try {
    pip install -r requirements.txt
    Write-Host "✅ Dependências instaladas com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao instalar dependências." -ForegroundColor Red
    Write-Host "Verifique sua conexão com a internet e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "============================================"
Write-Host "Iniciando aplicação web..."
Write-Host "============================================"
Write-Host ""
Write-Host "O navegador será aberto automaticamente."
Write-Host "Se não abrir, acesse: http://localhost:5000"
Write-Host ""
Write-Host "Para parar o servidor, pressione Ctrl+C"
Write-Host ""

# Iniciar aplicação web
try {
    python web_app.py
} catch {
    Write-Host ""
    Write-Host "❌ ERRO: Falha ao iniciar a aplicação." -ForegroundColor Red
}

Write-Host ""
Write-Host "Aplicação encerrada."
Read-Host "Pressione Enter para sair"