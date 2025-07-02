#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de teste para verificar se a implementação Python está funcionando
"""

import sys
import os
import tempfile
import shutil
from pathlib import Path

def test_python_implementation():
    """Testa a implementação Python básica"""
    print("🧪 Testando implementação Python...")
    print("=" * 50)
    
    # Verificar se o arquivo principal existe
    main_file = "criador_atalhos.py"
    if not os.path.exists(main_file):
        print(f"❌ ERRO: {main_file} não encontrado!")
        return False
    
    print(f"✅ {main_file} encontrado")
    
    # Verificar se requirements.txt existe
    req_file = "requirements.txt"
    if not os.path.exists(req_file):
        print(f"❌ ERRO: {req_file} não encontrado!")
        return False
    
    print(f"✅ {req_file} encontrado")
    
    # Verificar se scripts de build existem
    build_files = ["build-python.bat", "build-python.ps1"]
    for build_file in build_files:
        if not os.path.exists(build_file):
            print(f"❌ ERRO: {build_file} não encontrado!")
            return False
        print(f"✅ {build_file} encontrado")
    
    # Verificar se workflow existe
    workflow_file = ".github/workflows/build-and-release-python.yml"
    if not os.path.exists(workflow_file):
        print(f"❌ ERRO: {workflow_file} não encontrado!")
        return False
    
    print(f"✅ {workflow_file} encontrado")
    
    # Verificar se documentação existe
    doc_file = "README-PYTHON.md"
    if not os.path.exists(doc_file):
        print(f"❌ ERRO: {doc_file} não encontrado!")
        return False
    
    print(f"✅ {doc_file} encontrado")
    
    # Verificar sintaxe Python
    try:
        with open(main_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        compile(code, main_file, 'exec')
        print("✅ Sintaxe Python válida")
        
    except SyntaxError as e:
        print(f"❌ ERRO de sintaxe Python: {e}")
        return False
    
    # Verificar importações básicas (apenas em Windows)
    if sys.platform == "win32":
        try:
            import tkinter
            print("✅ tkinter disponível")
        except ImportError:
            print("❌ ERRO: tkinter não disponível")
            return False
    else:
        print("ℹ️ tkinter não testado (ambiente não Windows)")
    
    
    print()
    print("🎉 Todos os testes básicos passaram!")
    print("💡 Para teste completo, execute em ambiente Windows com as dependências instaladas")
    return True

def test_file_sizes():
    """Compara tamanhos dos arquivos"""
    print("\n📊 Comparação de tamanhos:")
    print("=" * 30)
    
    # Arquivo Python principal
    py_file = "criador_atalhos.py"
    if os.path.exists(py_file):
        size_kb = os.path.getsize(py_file) / 1024
        print(f"📄 {py_file}: {size_kb:.1f} KB")
    
    # Arquivo C# principal
    cs_file = "MainForm.cs"
    if os.path.exists(cs_file):
        size_kb = os.path.getsize(cs_file) / 1024
        print(f"📄 {cs_file}: {size_kb:.1f} KB")
    
    print(f"\n💡 Executável esperado:")
    print(f"   • Python: ~10-20 MB")
    print(f"   • C#: ~70-90 MB")
    print(f"   • Redução: ~75-80%")

if __name__ == "__main__":
    success = test_python_implementation()
    test_file_sizes()
    
    if success:
        print("\n✅ Implementação Python está pronta!")
        sys.exit(0)
    else:
        print("\n❌ Problemas encontrados na implementação")
        sys.exit(1)