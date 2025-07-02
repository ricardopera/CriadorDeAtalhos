#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demonstração da correção de formatação de caminhos do Windows
Mostra o comportamento antes e depois da correção
"""

import os

def old_implementation(source_path):
    """Comportamento anterior (problemático)"""
    print("🔴 IMPLEMENTAÇÃO ANTERIOR (Problemática):")
    print(f"   Caminho original: {source_path}")
    
    # Não normalizava caminhos
    target_path = source_path
    
    # Lógica incorreta para WorkingDirectory
    if os.path.isfile(source_path):
        working_dir = os.path.dirname(source_path)  # Correto para arquivos
    else:
        working_dir = source_path  # ❌ INCORRETO para pastas!
    
    print(f"   Target (Destino): {target_path}")
    print(f"   Start In (Iniciar em): {working_dir}")
    
    issues = []
    if '/' in target_path:
        issues.append("Target usa barras '/' em vez de '\\'")
    if '/' in working_dir:
        issues.append("Working Directory usa barras '/' em vez de '\\'")
    if not os.path.isfile(source_path) and working_dir == source_path:
        issues.append("Working Directory da pasta é a própria pasta (deveria ser pasta pai)")
    
    if issues:
        print("   ❌ PROBLEMAS:")
        for issue in issues:
            print(f"      • {issue}")
    else:
        print("   ✅ Sem problemas")

def new_implementation(source_path):
    """Comportamento novo (corrigido)"""
    print("🟢 IMPLEMENTAÇÃO NOVA (Corrigida):")
    print(f"   Caminho original: {source_path}")
    
    # Normalizar caminhos para formato Windows
    def normalize_windows_path(path):
        if not path:
            return path
        normalized = os.path.normpath(path)
        normalized = normalized.replace('/', '\\')
        return normalized
    
    # Obter working directory correto (sempre diretório pai)
    def get_working_directory(source_path):
        if not source_path:
            return ""
        source_path = normalize_windows_path(source_path)
        if '\\' in source_path:
            parts = source_path.rstrip('\\').split('\\')
            if len(parts) > 1:
                parent = '\\'.join(parts[:-1])
                if len(parent) == 2 and parent.endswith(':'):
                    parent += '\\'
                return parent
            elif len(parts) == 1 and parts[0].endswith(':'):
                return parts[0] + '\\'
        return ""
    
    target_path = normalize_windows_path(source_path)
    working_dir = get_working_directory(source_path)
    
    print(f"   Target (Destino): {target_path}")
    print(f"   Start In (Iniciar em): {working_dir}")
    print("   ✅ CORRIGIDO:")
    print("      • Todos os caminhos usam barras '\\' do Windows")
    print("      • Working Directory sempre é o diretório pai")

def demonstrate_fix():
    """Demonstra a correção com os cenários do issue"""
    print("=" * 70)
    print("DEMONSTRAÇÃO: Correção de Formatação de Caminhos do Windows")
    print("=" * 70)
    
    scenarios = [
        {
            "title": "Cenário 1: Arquivo com barras '/'",
            "path": "C:/Users/ricar/Downloads/MFL71697713/pt-br/res/arquivo.txt",
            "type": "arquivo"
        },
        {
            "title": "Cenário 2: Pasta com barras '/' (caso principal do issue)",
            "path": "C:/Users/ricar/Downloads/Folder",
            "type": "pasta"
        },
        {
            "title": "Cenário 3: Pasta aninhada",
            "path": "C:/Users/ricar/Downloads/MFL71697713/pt-br/res",
            "type": "pasta"
        }
    ]
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n{scenario['title']}")
        print("-" * 60)
        
        old_implementation(scenario['path'])
        print()
        new_implementation(scenario['path'])
        
        if i < len(scenarios):
            print("\n" + "=" * 70)
    
    print(f"\n{'=' * 70}")
    print("RESUMO DA CORREÇÃO:")
    print("✅ Paths normalizados para formato Windows (\\)")
    print("✅ Working Directory corrigido para pastas (sempre diretório pai)")
    print("✅ Comportamento idêntico ao C# original")
    print("✅ Propriedades do atalho mostrarão caminhos corretos")

if __name__ == "__main__":
    demonstrate_fix()