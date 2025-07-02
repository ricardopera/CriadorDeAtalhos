#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Criador de Atalhos - Versão Python
Aplicação para criar atalhos de arquivos e diretórios no Windows

Autor: Ricardo Pereira
Versão: 1.0.3-py
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
import sys
import subprocess
import tempfile
import webbrowser
from pathlib import Path

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


class CriadorAtalhos:
    def __init__(self):
        self.root = tk.Tk()
        self.setup_window()
        self.create_widgets()
        self.detect_clipboard_content()
        
    def setup_window(self):
        """Configura a janela principal"""
        self.root.title("Criador de Atalhos")
        self.root.geometry("550x460")
        self.root.resizable(False, False)
        
        # Centralizar janela
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (550 // 2)
        y = (self.root.winfo_screenheight() // 2) - (460 // 2)
        self.root.geometry(f"550x460+{x}+{y}")
        
        # Configurar estilo
        style = ttk.Style()
        style.theme_use('winnative')
        
    def create_widgets(self):
        """Cria todos os widgets da interface"""
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Caminho do arquivo/diretório
        ttk.Label(main_frame, text="Caminho do arquivo ou diretório:").pack(anchor=tk.W, pady=(0, 5))
        
        path_frame = ttk.Frame(main_frame)
        path_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.path_var = tk.StringVar()
        self.path_entry = ttk.Entry(path_frame, textvariable=self.path_var, width=60)
        self.path_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.path_entry.bind('<KeyRelease>', self.on_path_change)
        
        ttk.Button(path_frame, text="Selecionar Arquivo", 
                  command=self.browse_file).pack(side=tk.RIGHT)
        
        # Botão para selecionar pasta
        folder_frame = ttk.Frame(main_frame)
        folder_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Button(folder_frame, text="Selecionar Pasta", 
                  command=self.browse_folder).pack(side=tk.LEFT)
        
        ttk.Button(folder_frame, text="Detectar da Área de Transferência", 
                  command=self.detect_clipboard_content).pack(side=tk.LEFT, padx=(10, 0))
        
        # Destino do atalho
        ttk.Label(main_frame, text="Destino do atalho:").pack(anchor=tk.W, pady=(20, 5))
        
        self.destination_var = tk.StringVar(value="desktop")
        
        ttk.Radiobutton(main_frame, text="Área de Trabalho", 
                       variable=self.destination_var, value="desktop",
                       command=self.on_destination_change).pack(anchor=tk.W, pady=2)
        
        custom_frame = ttk.Frame(main_frame)
        custom_frame.pack(fill=tk.X, pady=2)
        
        ttk.Radiobutton(custom_frame, text="Local personalizado:", 
                       variable=self.destination_var, value="custom",
                       command=self.on_destination_change).pack(side=tk.LEFT)
        
        self.custom_path_var = tk.StringVar()
        self.custom_path_entry = ttk.Entry(custom_frame, textvariable=self.custom_path_var, 
                                          width=35, state=tk.DISABLED)
        self.custom_path_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(10, 5))
        self.custom_path_entry.bind('<KeyRelease>', self.validate_input)
        
        self.browse_dest_btn = ttk.Button(custom_frame, text="Navegar", 
                                         command=self.browse_destination, state=tk.DISABLED)
        self.browse_dest_btn.pack(side=tk.RIGHT)
        
        # Botão criar atalho
        self.create_btn = ttk.Button(main_frame, text="Criar Atalho", 
                                    command=self.create_shortcut, state=tk.DISABLED)
        self.create_btn.pack(pady=(30, 10))
        
        # Status
        self.status_var = tk.StringVar(value="Selecione um arquivo ou pasta para criar o atalho.")
        self.status_label = ttk.Label(main_frame, textvariable=self.status_var, 
                                     foreground="gray")
        self.status_label.pack(pady=(0, 20))
        
        # Informações do desenvolvedor
        dev_frame = ttk.Frame(main_frame)
        dev_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=(20, 0))
        
        ttk.Label(dev_frame, text="Desenvolvido por: Ricardo Pereira", 
                 font=("Segoe UI", 8)).pack(side=tk.LEFT)
        
        github_link = ttk.Label(dev_frame, text="GitHub", font=("Segoe UI", 8), 
                               foreground="blue", cursor="hand2")
        github_link.pack(side=tk.RIGHT)
        github_link.bind("<Button-1>", self.open_github)
        
    def browse_file(self):
        """Abre diálogo para selecionar arquivo"""
        filename = filedialog.askopenfilename(
            title="Selecionar arquivo",
            filetypes=[("Todos os arquivos", "*.*")]
        )
        if filename:
            self.path_var.set(filename)
            self.set_status("Arquivo selecionado com sucesso.", "green")
            self.validate_input()
            
    def browse_folder(self):
        """Abre diálogo para selecionar pasta"""
        foldername = filedialog.askdirectory(title="Selecionar pasta")
        if foldername:
            self.path_var.set(foldername)
            self.set_status("Pasta selecionada com sucesso.", "green")
            self.validate_input()
            
    def browse_destination(self):
        """Abre diálogo para selecionar destino personalizado"""
        foldername = filedialog.askdirectory(title="Selecionar destino do atalho")
        if foldername:
            self.custom_path_var.set(foldername)
            self.validate_input()
            
    def detect_clipboard_content(self):
        """Detecta conteúdo da área de transferência"""
        if not CLIPBOARD_AVAILABLE:
            self.set_status("Área de transferência não disponível (pyperclip não instalado).", "orange")
            return
            
        try:
            clipboard_text = pyperclip.paste().strip()
            
            if clipboard_text and (os.path.isfile(clipboard_text) or os.path.isdir(clipboard_text)):
                self.path_var.set(clipboard_text)
                self.set_status("Caminho detectado da área de transferência.", "green")
                self.validate_input()
            else:
                self.set_status("Área de transferência não contém um caminho válido.", "orange")
                
        except Exception as e:
            self.set_status(f"Erro ao acessar área de transferência: {str(e)}", "red")
            
    def on_path_change(self, event=None):
        """Chamado quando o caminho é alterado"""
        self.validate_input()
        
    def on_destination_change(self):
        """Chamado quando o destino é alterado"""
        if self.destination_var.get() == "custom":
            self.custom_path_entry.config(state=tk.NORMAL)
            self.browse_dest_btn.config(state=tk.NORMAL)
        else:
            self.custom_path_entry.config(state=tk.DISABLED)
            self.browse_dest_btn.config(state=tk.DISABLED)
        self.validate_input()
        
    def validate_input(self, event=None):
        """Valida os campos de entrada"""
        path = self.path_var.get().strip()
        is_valid_path = path and (os.path.isfile(path) or os.path.isdir(path))
        
        if self.destination_var.get() == "desktop":
            is_valid_destination = True
        else:
            custom_dest = self.custom_path_var.get().strip()
            is_valid_destination = custom_dest and os.path.isdir(custom_dest)
            
        # Habilitar/desabilitar botão
        if is_valid_path and is_valid_destination:
            self.create_btn.config(state=tk.NORMAL)
            if path and not (os.path.isfile(path) or os.path.isdir(path)):
                self.set_status("Caminho inválido ou não existe.", "red")
        else:
            self.create_btn.config(state=tk.DISABLED)
            if path and not (os.path.isfile(path) or os.path.isdir(path)):
                self.set_status("Caminho inválido ou não existe.", "red")
            elif self.destination_var.get() == "custom" and not is_valid_destination:
                self.set_status("Destino personalizado inválido.", "red")
                
    def set_status(self, message, color="gray"):
        """Define a mensagem de status com cor"""
        self.status_var.set(message)
        self.status_label.config(foreground=color)
        
    def _get_desktop_path(self):
        """Obtém o caminho correto da Área de Trabalho usando a API do Windows"""
        if not WIN32_AVAILABLE:
            # Fallback para o método antigo se pywin32 não estiver disponível
            return os.path.join(os.path.expanduser("~"), "Desktop")
        
        try:
            # Usar a API do Windows para obter o caminho correto da Área de Trabalho
            # Equivalente ao Environment.GetFolderPath(Environment.SpecialFolder.Desktop) do C#
            desktop_path = shell.SHGetFolderPath(0, shellcon.CSIDL_DESKTOP, None, 0)
            return desktop_path
        except Exception:
            # Fallback se houver erro com a API
            return os.path.join(os.path.expanduser("~"), "Desktop")
        
    def create_shortcut(self):
        """Cria o atalho"""
        try:
            source_path = self.path_var.get().strip()
            
            if self.destination_var.get() == "desktop":
                destination_folder = self._get_desktop_path()
            else:
                destination_folder = self.custom_path_var.get().strip()
                
            # Determinar nome do arquivo
            if os.path.isfile(source_path):
                filename = os.path.splitext(os.path.basename(source_path))[0]
            else:
                filename = os.path.basename(source_path.rstrip(os.sep))
                
            shortcut_path = os.path.join(destination_folder, f"{filename}.lnk")
            
            # Verificar se já existe e adicionar numeração
            counter = 1
            original_shortcut_path = shortcut_path
            while os.path.exists(shortcut_path):
                shortcut_path = os.path.join(destination_folder, f"{filename} ({counter}).lnk")
                counter += 1
                
            # Criar o atalho usando COM
            self._create_windows_shortcut(source_path, shortcut_path)
            
            self.set_status(f"Atalho criado com sucesso em: {shortcut_path}", "green")
            
            # Perguntar se deseja abrir a pasta
            result = messagebox.askyesno(
                "Atalho Criado",
                f"Atalho criado com sucesso!\n\nDeseja abrir a pasta onde o atalho foi criado?"
            )
            
            if result:
                # Selecionar o arquivo no Explorer
                subprocess.run(f'explorer /select,"{shortcut_path}"', shell=True)
                
        except Exception as e:
            error_msg = f"Erro ao criar atalho: {str(e)}"
            self.set_status(error_msg, "red")
            messagebox.showerror("Erro", error_msg)
            
    def _create_windows_shortcut(self, source_path, shortcut_path):
        """Cria atalho usando COM (equivalente ao código C#)"""
        if not WIN32_AVAILABLE:
            raise Exception("pywin32 não está disponível. Instale com: pip install pywin32")
            
        pythoncom.CoInitialize()
        try:
            shell = win32com.client.Dispatch("WScript.Shell")
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = source_path
            shortcut.WorkingDirectory = os.path.dirname(source_path) if os.path.isfile(source_path) else source_path
            
            # Adicionar descrição
            if os.path.isfile(source_path):
                shortcut.Description = f"Atalho para arquivo: {os.path.basename(source_path)}"
            else:
                shortcut.Description = f"Atalho para pasta: {os.path.basename(source_path)}"
                
            shortcut.save()
        finally:
            pythoncom.CoUninitialize()
            
    def open_github(self, event):
        """Abre o link do GitHub"""
        try:
            webbrowser.open("https://github.com/ricardopera/CriadorDeAtalhos")
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao abrir o link:\n{str(e)}")
            
    def run(self):
        """Inicia a aplicação"""
        self.root.mainloop()


def main():
    """Função principal"""
    if sys.platform != "win32":
        print("Esta aplicação funciona apenas no Windows.")
        sys.exit(1)
    
    # Verificar dependências críticas
    missing_deps = []
    if not WIN32_AVAILABLE:
        missing_deps.append("pywin32")
    if not CLIPBOARD_AVAILABLE:
        missing_deps.append("pyperclip")
    
    if missing_deps:
        error_msg = f"Dependências não encontradas: {', '.join(missing_deps)}\n"
        error_msg += f"Instale com: pip install {' '.join(missing_deps)}"
        print(error_msg)
        try:
            messagebox.showerror("Dependências Faltando", error_msg)
        except:
            pass
        sys.exit(1)
        
    try:
        app = CriadorAtalhos()
        app.run()
    except Exception as e:
        error_msg = f"Erro ao iniciar a aplicação:\n{str(e)}"
        print(error_msg)
        try:
            messagebox.showerror("Erro Fatal", error_msg)
        except:
            pass
        sys.exit(1)


if __name__ == "__main__":
    main()