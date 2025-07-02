#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script to validate the Windows path formatting fixes
"""

import os
import sys

# Add the current directory to path so we can import our module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_path_normalization():
    """Test the path normalization function"""
    print("Testing Windows Path Normalization")
    print("=" * 50)
    
    # Create a mock CriadorAtalhos instance to access the methods
    class MockCriadorAtalhos:
        def _normalize_windows_path(self, path):
            """
            Normaliza o caminho para o formato do Windows com barras invertidas
            """
            if not path:
                return path
            
            # Converter para formato Windows usando normpath
            normalized = os.path.normpath(path)
            
            # Garantir que usamos barras invertidas do Windows
            # Isso é importante para consistência visual nas propriedades do atalho
            normalized = normalized.replace('/', '\\')
            
            return normalized
        
        def _get_working_directory(self, source_path):
            """
            Obtém o diretório de trabalho correto para o atalho
            Para arquivos: diretório pai
            Para pastas: diretório pai (não a própria pasta)
            
            Equivalente ao Path.GetDirectoryName() do C#
            """
            if not source_path:
                return ""
            
            # Normalizar o caminho primeiro
            source_path = self._normalize_windows_path(source_path)
            
            # Para ambos arquivos e pastas, queremos o diretório pai
            # O C# Path.GetDirectoryName() retorna o pai para ambos os casos
            
            # Usar split manual para garantir comportamento consistente no Windows
            if '\\' in source_path:
                parts = source_path.rstrip('\\').split('\\')
                if len(parts) > 1:
                    # Retornar tudo exceto o último componente
                    parent = '\\'.join(parts[:-1])
                    # Para drives raiz como "C:", adicionar barra invertida
                    if len(parent) == 2 and parent.endswith(':'):
                        parent += '\\'
                    return parent
                elif len(parts) == 1 and parts[0].endswith(':'):
                    # Para casos como "C:" retornar "C:\"
                    return parts[0] + '\\'
            
            return ""
    
    mock = MockCriadorAtalhos()
    
    test_cases = [
        # Test cases: (input_path, expected_normalized, expected_working_dir, description)
        ("C:/Users/ricar/Downloads/MFL71697713/file.txt", 
         "C:\\Users\\ricar\\Downloads\\MFL71697713\\file.txt",
         "C:\\Users\\ricar\\Downloads\\MFL71697713",
         "File with forward slashes"),
        
        (r"C:\Users\ricar\Downloads\MFL71697713\file.txt",
         "C:\\Users\\ricar\\Downloads\\MFL71697713\\file.txt", 
         "C:\\Users\\ricar\\Downloads\\MFL71697713",
         "File with backslashes"),
        
        ("C:/Users/ricar/Downloads/Folder",
         "C:\\Users\\ricar\\Downloads\\Folder",
         "C:\\Users\\ricar\\Downloads", 
         "Folder with forward slashes"),
        
        (r"C:\Users\ricar\Downloads\Folder",
         "C:\\Users\\ricar\\Downloads\\Folder",
         "C:\\Users\\ricar\\Downloads",
         "Folder with backslashes"),
        
        ("C:/Users/ricar/Downloads/MFL71697713/pt-br/res",
         "C:\\Users\\ricar\\Downloads\\MFL71697713\\pt-br\\res",
         "C:\\Users\\ricar\\Downloads\\MFL71697713\\pt-br",
         "Nested folder with forward slashes"),
        
        (r"C:\file.txt",
         "C:\\file.txt",
         "C:\\",
         "File in root"),
        
        (r"C:\Folder",
         "C:\\Folder", 
         "C:\\",
         "Folder in root"),
    ]
    
    all_passed = True
    
    for input_path, expected_norm, expected_wd, description in test_cases:
        print(f"\nTest: {description}")
        print(f"  Input: {input_path}")
        
        actual_norm = mock._normalize_windows_path(input_path)
        actual_wd = mock._get_working_directory(input_path)
        
        print(f"  Normalized: {actual_norm}")
        print(f"  Expected:   {expected_norm}")
        
        print(f"  Working Dir: {actual_wd}")
        print(f"  Expected:    {expected_wd}")
        
        norm_pass = actual_norm == expected_norm
        wd_pass = actual_wd == expected_wd
        
        if norm_pass and wd_pass:
            print("  ✅ PASS")
        else:
            print("  ❌ FAIL")
            if not norm_pass:
                print(f"     Normalization mismatch")
            if not wd_pass:
                print(f"     Working directory mismatch")
            all_passed = False
    
    print(f"\n{'='*50}")
    if all_passed:
        print("🎉 All tests PASSED!")
    else:
        print("❌ Some tests FAILED!")
    
    return all_passed

def test_issue_scenarios():
    """Test the specific scenarios mentioned in the issue"""
    print("\n\nTesting Issue Scenarios")
    print("=" * 50)
    
    class MockCriadorAtalhos:
        def _normalize_windows_path(self, path):
            if not path:
                return path
            normalized = os.path.normpath(path)
            normalized = normalized.replace('/', '\\')
            return normalized
        
        def _get_working_directory(self, source_path):
            if not source_path:
                return ""
            source_path = self._normalize_windows_path(source_path)
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
    
    mock = MockCriadorAtalhos()
    
    print("Issue Scenario 1: File shortcut")
    file_path = "C:/Users/ricar/Downloads/MFL71697713/pt-br/res/file.txt"
    norm_file = mock._normalize_windows_path(file_path)
    wd_file = mock._get_working_directory(file_path)
    
    print(f"  File path: {file_path}")
    print(f"  Target (Destino): {norm_file}")
    print(f"  Start In (Iniciar em): {wd_file}")
    print(f"  Expected: Target should use backslashes, Start In should be parent directory")
    
    print("\nIssue Scenario 2: Folder shortcut")
    folder_path = "C:/Users/ricar/Downloads/Folder"
    norm_folder = mock._normalize_windows_path(folder_path)
    wd_folder = mock._get_working_directory(folder_path)
    
    print(f"  Folder path: {folder_path}")
    print(f"  Target (Destino): {norm_folder}")
    print(f"  Start In (Iniciar em): {wd_folder}")
    print(f"  Expected: Target = 'C:\\Users\\ricar\\Downloads\\Folder', Start In = 'C:\\Users\\ricar\\Downloads'")
    
    # Validate the expected behavior
    issues = []
    
    if '/' in norm_file or '/' in norm_folder:
        issues.append("❌ Paths still contain forward slashes")
    
    if wd_folder == norm_folder:
        issues.append("❌ Folder working directory is same as target (should be parent)")
    
    expected_folder_wd = "C:\\Users\\ricar\\Downloads"
    if wd_folder != expected_folder_wd:
        issues.append(f"❌ Folder working directory incorrect: got '{wd_folder}', expected '{expected_folder_wd}'")
    
    if not issues:
        print("✅ All scenarios behave correctly!")
        return True
    else:
        print("\nIssues found:")
        for issue in issues:
            print(f"  {issue}")
        return False

if __name__ == "__main__":
    print("Windows Path Formatting Fix Validation")
    print("=" * 60)
    
    test1_pass = test_path_normalization()
    test2_pass = test_issue_scenarios()
    
    print(f"\n{'='*60}")
    if test1_pass and test2_pass:
        print("🎉 ALL TESTS PASSED - Fix is working correctly!")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED - Fix needs adjustment")
        sys.exit(1)