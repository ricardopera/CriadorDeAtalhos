#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Criador de Atalhos - Versão Web
Aplicação web para criar atalhos de arquivos e diretórios no Windows

Autor: Ricardo Pereira
Versão: 1.0.0-web
"""

import os
import sys
import webbrowser
import threading
import time
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file

# Importar lógica de criação de atalhos do módulo existente
# Verificar dependências opcionais
try:
    import win32com.client
    import pythoncom
    from win32com.shell import shell, shellcon
    WIN32_AVAILABLE = True
except ImportError:
    WIN32_AVAILABLE = False
    
try:
    import pyperclip
    CLIPBOARD_AVAILABLE = True
except ImportError:
    CLIPBOARD_AVAILABLE = False

app = Flask(__name__)

class WebShortcutCreator:
    """Classe para criar atalhos via interface web"""
    
    def __init__(self):
        self.app = app
        
    def _get_desktop_path(self):
        """Obtém o caminho correto da Área de Trabalho usando a API do Windows"""
        if not WIN32_AVAILABLE:
            # Fallback para o método antigo se pywin32 não estiver disponível
            return os.path.join(os.path.expanduser("~"), "Desktop")
        
        try:
            # Usar a API do Windows para obter o caminho correto da Área de Trabalho
            desktop_path = shell.SHGetFolderPath(0, shellcon.CSIDL_DESKTOP, None, 0)
            return desktop_path
        except Exception:
            # Fallback se houver erro com a API
            return os.path.join(os.path.expanduser("~"), "Desktop")
    
    def _normalize_windows_path(self, path):
        """Normaliza o caminho para o formato do Windows com barras invertidas"""
        if not path:
            return path
        
        # Converter para formato Windows usando normpath
        normalized = os.path.normpath(path)
        
        # Garantir que usamos barras invertidas do Windows
        normalized = normalized.replace('/', '\\')
        
        return normalized
    
    def _get_working_directory(self, source_path):
        """Obtém o diretório de trabalho correto para o atalho"""
        if not source_path:
            return ""
        
        # Normalizar o caminho primeiro
        source_path = self._normalize_windows_path(source_path)
        
        # Para ambos arquivos e pastas, queremos o diretório pai
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
    
    def _create_windows_shortcut(self, source_path, shortcut_path):
        """Cria atalho usando COM (equivalente ao código C#)"""
        if not WIN32_AVAILABLE:
            raise Exception("pywin32 não está disponível. Instale com: pip install pywin32")
            
        pythoncom.CoInitialize()
        try:
            shell_obj = win32com.client.Dispatch("WScript.Shell")
            shortcut = shell_obj.CreateShortCut(shortcut_path)
            
            # Normalizar caminhos para formato Windows
            normalized_source = self._normalize_windows_path(source_path)
            
            # Configurar target (sempre o caminho normalizado)
            shortcut.Targetpath = normalized_source
            
            # Configurar working directory (sempre o diretório pai)
            working_dir = self._get_working_directory(normalized_source)
            shortcut.WorkingDirectory = working_dir
            
            # Adicionar descrição
            if os.path.isfile(source_path):
                shortcut.Description = f"Atalho para arquivo: {os.path.basename(source_path)}"
            else:
                shortcut.Description = f"Atalho para pasta: {os.path.basename(source_path)}"
                
            shortcut.save()
        finally:
            pythoncom.CoUninitialize()
    
    def create_shortcut(self, source_path, destination_folder=None, custom_name=None):
        """Cria o atalho com os parâmetros especificados"""
        try:
            # Determinar pasta de destino
            if destination_folder is None:
                destination_folder = self._get_desktop_path()
            
            # Normalizar caminhos
            source_path = self._normalize_windows_path(source_path)
            destination_folder = self._normalize_windows_path(destination_folder)
                
            # Determinar nome do arquivo
            if custom_name:
                filename = custom_name
            elif os.path.isfile(source_path):
                filename = os.path.splitext(os.path.basename(source_path))[0]
            else:
                filename = os.path.basename(source_path.rstrip('\\').rstrip('/'))
                
            shortcut_path = os.path.join(destination_folder, f"{filename}.lnk")
            shortcut_path = self._normalize_windows_path(shortcut_path)
            
            # Verificar se já existe e adicionar numeração
            counter = 1
            original_shortcut_path = shortcut_path
            while os.path.exists(shortcut_path):
                test_filename = f"{filename} ({counter})"
                shortcut_path = os.path.join(destination_folder, f"{test_filename}.lnk")
                shortcut_path = self._normalize_windows_path(shortcut_path)
                counter += 1
                
            # Criar o atalho usando COM
            self._create_windows_shortcut(source_path, shortcut_path)
            
            return {
                'success': True,
                'message': 'Atalho criado com sucesso!',
                'shortcut_path': shortcut_path
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro ao criar atalho: {str(e)}',
                'shortcut_path': None
            }

# Instância global do criador de atalhos
shortcut_creator = WebShortcutCreator()

@app.route('/')
def index():
    """Página principal da aplicação"""
    return render_template('index.html')

@app.route('/api/validate_path', methods=['POST'])
def validate_path():
    """API para validar se um caminho existe"""
    try:
        data = request.json
        path = data.get('path', '').strip()
        
        if not path:
            return jsonify({'valid': False, 'message': 'Caminho não fornecido'})
        
        if os.path.isfile(path) or os.path.isdir(path):
            path_type = 'arquivo' if os.path.isfile(path) else 'pasta'
            return jsonify({
                'valid': True, 
                'message': f'{path_type.title()} válido(a)',
                'type': path_type
            })
        else:
            return jsonify({'valid': False, 'message': 'Caminho inválido ou não existe'})
            
    except Exception as e:
        return jsonify({'valid': False, 'message': f'Erro ao validar caminho: {str(e)}'})

@app.route('/api/get_clipboard', methods=['GET'])
def get_clipboard():
    """API para obter conteúdo da área de transferência"""
    try:
        if not CLIPBOARD_AVAILABLE:
            return jsonify({
                'success': False, 
                'message': 'Área de transferência não disponível (pyperclip não instalado)'
            })
            
        clipboard_text = pyperclip.paste().strip()
        
        if clipboard_text and (os.path.isfile(clipboard_text) or os.path.isdir(clipboard_text)):
            path_type = 'arquivo' if os.path.isfile(clipboard_text) else 'pasta'
            return jsonify({
                'success': True,
                'path': clipboard_text,
                'message': f'Caminho de {path_type} detectado da área de transferência',
                'type': path_type
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Área de transferência não contém um caminho válido'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao acessar área de transferência: {str(e)}'
        })

@app.route('/api/create_shortcut', methods=['POST'])
def create_shortcut_api():
    """API para criar atalho"""
    try:
        data = request.json
        source_path = data.get('source_path', '').strip()
        destination_type = data.get('destination_type', 'desktop')
        custom_destination = data.get('custom_destination', '').strip()
        custom_name = data.get('custom_name', '').strip()
        
        # Validar caminho de origem
        if not source_path or not (os.path.isfile(source_path) or os.path.isdir(source_path)):
            return jsonify({
                'success': False,
                'message': 'Caminho de origem inválido ou não existe'
            })
        
        # Determinar destino
        destination_folder = None
        if destination_type == 'custom':
            if not custom_destination or not os.path.isdir(custom_destination):
                return jsonify({
                    'success': False,
                    'message': 'Destino personalizado inválido'
                })
            destination_folder = custom_destination
        
        # Criar atalho
        result = shortcut_creator.create_shortcut(
            source_path=source_path,
            destination_folder=destination_folder,
            custom_name=custom_name if custom_name else None
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao processar solicitação: {str(e)}'
        })

@app.route('/api/system_info', methods=['GET'])
def system_info():
    """API para obter informações do sistema"""
    return jsonify({
        'platform': sys.platform,
        'win32_available': WIN32_AVAILABLE,
        'clipboard_available': CLIPBOARD_AVAILABLE,
        'desktop_path': shortcut_creator._get_desktop_path() if WIN32_AVAILABLE else None
    })

def open_browser():
    """Abre o navegador automaticamente após iniciar o servidor"""
    time.sleep(1.5)  # Aguardar servidor inicializar
    try:
        webbrowser.open('http://localhost:5000')
    except Exception as e:
        print(f"Não foi possível abrir o navegador automaticamente: {e}")
        print("Acesse manualmente: http://localhost:5000")

def main():
    """Função principal para iniciar a aplicação web"""
    if sys.platform != "win32":
        print("AVISO: Esta aplicação foi projetada para Windows.")
        print("Algumas funcionalidades podem não funcionar corretamente em outros sistemas.")
        print()
    
    # Verificar dependências críticas
    missing_deps = []
    if not WIN32_AVAILABLE:
        missing_deps.append("pywin32")
    if not CLIPBOARD_AVAILABLE:
        missing_deps.append("pyperclip")
    
    if missing_deps:
        print(f"AVISO: Dependências opcionais não encontradas: {', '.join(missing_deps)}")
        print(f"Para funcionalidade completa, instale com: pip install {' '.join(missing_deps)}")
        print()
    
    print("🔗 Criador de Atalhos - Versão Web")
    print("==================================")
    print("Iniciando servidor web...")
    print("O navegador será aberto automaticamente.")
    print("Se não abrir, acesse: http://localhost:5000")
    print("Para parar o servidor, pressione Ctrl+C")
    print()
    
    # Abrir navegador em thread separada
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    try:
        # Iniciar servidor Flask
        app.run(host='localhost', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\nServidor parado pelo usuário.")
    except Exception as e:
        print(f"Erro ao iniciar servidor: {e}")

if __name__ == "__main__":
    main()