#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste da versão web do Criador de Atalhos
"""

import sys
import os
import unittest
import tempfile
import shutil
from unittest.mock import patch, MagicMock

# Adicionar o diretório atual ao path para importar o módulo web_app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from web_app import app, WebShortcutCreator
    WEB_APP_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Erro ao importar web_app: {e}")
    WEB_APP_AVAILABLE = False

class TestWebApp(unittest.TestCase):
    """Testes para a aplicação web"""
    
    def setUp(self):
        """Configurar testes"""
        if not WEB_APP_AVAILABLE:
            self.skipTest("web_app não disponível")
            
        self.app = app.test_client()
        self.app.testing = True
        
    def test_homepage_loads(self):
        """Testar se a página inicial carrega"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Criador de Atalhos', response.data)
        self.assertIn(b'Vers\xc3\xa3o Web', response.data)
        
    def test_system_info_api(self):
        """Testar API de informações do sistema"""
        response = self.app.get('/api/system_info')
        self.assertEqual(response.status_code, 200)
        
        import json
        data = json.loads(response.data)
        
        self.assertIn('platform', data)
        self.assertIn('win32_available', data)
        self.assertIn('clipboard_available', data)
        
    def test_validate_path_api_invalid(self):
        """Testar API de validação de caminho com caminho inválido"""
        response = self.app.post('/api/validate_path',
                                json={'path': '/caminho/inexistente'})
        self.assertEqual(response.status_code, 200)
        
        import json
        data = json.loads(response.data)
        self.assertFalse(data['valid'])
        
    def test_validate_path_api_empty(self):
        """Testar API de validação de caminho vazio"""
        response = self.app.post('/api/validate_path',
                                json={'path': ''})
        self.assertEqual(response.status_code, 200)
        
        import json
        data = json.loads(response.data)
        self.assertFalse(data['valid'])
        
    def test_create_shortcut_api_invalid_path(self):
        """Testar API de criação de atalho com caminho inválido"""
        response = self.app.post('/api/create_shortcut',
                                json={
                                    'source_path': '/caminho/inexistente',
                                    'destination_type': 'desktop'
                                })
        self.assertEqual(response.status_code, 200)
        
        import json
        data = json.loads(response.data)
        self.assertFalse(data['success'])
        
    def test_shortcut_creator_class(self):
        """Testar classe WebShortcutCreator"""
        creator = WebShortcutCreator()
        
        # Testar normalização de caminhos
        path = "C:/Users/Test/file.txt"
        normalized = creator._normalize_windows_path(path)
        self.assertEqual(normalized, "C:\\Users\\Test\\file.txt")
        
        # Testar diretório de trabalho
        working_dir = creator._get_working_directory("C:\\Users\\Test\\file.txt")
        self.assertEqual(working_dir, "C:\\Users\\Test")

def run_web_tests():
    """Executar todos os testes da versão web"""
    print("🧪 Testando versão web do Criador de Atalhos...")
    print("=" * 50)
    
    if not WEB_APP_AVAILABLE:
        print("❌ web_app.py não pôde ser importado")
        print("   Certifique-se de que o Flask está instalado: pip install flask")
        return False
        
    # Executar testes
    suite = unittest.TestLoader().loadTestsFromTestCase(TestWebApp)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n📊 Resumo dos testes:")
    print("=" * 30)
    print(f"✅ Testes executados: {result.testsRun}")
    print(f"❌ Falhas: {len(result.failures)}")
    print(f"⚠️ Erros: {len(result.errors)}")
    
    if result.failures:
        print("\n💥 Falhas:")
        for test, traceback in result.failures:
            print(f"   - {test}: {traceback}")
            
    if result.errors:
        print("\n🔥 Erros:")
        for test, traceback in result.errors:
            print(f"   - {test}: {traceback}")
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    
    if success:
        print("\n🎉 Todos os testes da versão web passaram!")
        print("\n💡 Para testar completamente:")
        print("   1. Execute: python web_app.py")
        print("   2. Acesse: http://localhost:5000")
        print("   3. Teste a interface manualmente")
    else:
        print("\n⚠️ Alguns testes falharam.")
        
    return success

if __name__ == "__main__":
    success = run_web_tests()
    sys.exit(0 if success else 1)