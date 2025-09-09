# 🌐 Criador de Atalhos - Versão Web

Uma versão web do aplicativo Criador de Atalhos que permite criar atalhos Windows através do navegador.

## 📋 O que é a Versão Web?

A versão web é uma interface de navegador que executa um servidor local em Python para criar atalhos no sistema de arquivos do Windows. Combina a conveniência de uma interface web moderna com a funcionalidade completa de criação de atalhos locais.

## 🎯 Características

- **Interface web moderna**: Design responsivo e intuitivo
- **Funcionalidade completa**: Todas as funcionalidades da versão desktop
- **Acesso pelo navegador**: Use Chrome, Firefox, Edge ou qualquer navegador moderno
- **Servidor local**: Roda em `localhost:5000` para máxima segurança
- **Detecção de área de transferência**: Detecta automaticamente caminhos copiados
- **Validação em tempo real**: Verifica caminhos enquanto você digita
- **Modais informativos**: Feedback claro sobre o sucesso ou erro das operações

## 🚀 Como Usar

### Método 1: Scripts de Inicialização (Recomendado)

**Windows Command Prompt:**
```cmd
start-web.bat
```

**Windows PowerShell:**
```powershell
.\start-web.ps1
```

### Método 2: Manual

1. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Iniciar o servidor:**
   ```bash
   python web_app.py
   ```

3. **Acessar no navegador:**
   - O navegador abrirá automaticamente
   - Ou acesse manualmente: `http://localhost:5000`

## 💻 Interface Web

### Como Inserir Caminhos

Devido às limitações de segurança dos navegadores, você não pode navegar diretamente pelos arquivos. Use uma das seguintes opções:

1. **Área de Transferência (Mais Fácil):**
   - No Explorer, pressione `Ctrl+L` para selecionar a barra de endereços
   - Copie o caminho com `Ctrl+C`
   - Clique em "Detectar da Área de Transferência"

2. **Digitação Manual:**
   - Digite ou cole o caminho completo diretamente
   - Exemplo: `C:\Users\SeuNome\Desktop\arquivo.txt`

3. **Cópia Direta:**
   - Copie o caminho de qualquer lugar
   - Cole no campo com `Ctrl+V`

### Opções de Destino

- **Área de Trabalho**: Cria o atalho na área de trabalho do usuário
- **Local personalizado**: Especifique uma pasta personalizada para o atalho

### Nome Personalizado

Opcionalmente, especifique um nome personalizado para o atalho. Se deixado em branco, usa o nome original do arquivo/pasta.

## 🔧 Requisitos

### Sistema
- Windows 10 ou superior
- Python 3.7 ou superior

### Dependências
- `flask` - Framework web
- `pywin32` - APIs do Windows (para criar atalhos)
- `pyperclip` - Acesso à área de transferência

Instale com:
```bash
pip install flask pywin32 pyperclip
```

Ou use o arquivo `requirements.txt`:
```bash
pip install -r requirements.txt
```

## 🌐 Navegadores Suportados

- ✅ **Google Chrome** (Recomendado)
- ✅ **Microsoft Edge**
- ✅ **Mozilla Firefox**
- ✅ **Safari** (funcionalidade limitada)
- ✅ **Opera**

## 🛡️ Segurança

- **Servidor local apenas**: Roda apenas em `localhost` (127.0.0.1)
- **Sem acesso remoto**: Não aceita conexões de outros computadores
- **Sem coleta de dados**: Nenhuma informação é enviada para servidores externos
- **APIs locais**: Usa apenas APIs do Windows para criar atalhos

## ⚠️ Limitações dos Navegadores

Devido às políticas de segurança dos navegadores modernos:

1. **Sem navegação de arquivos**: Não é possível navegar diretamente pelos arquivos
2. **Caminhos manuais**: Você deve digitar ou colar os caminhos manualmente
3. **Sem acesso ao sistema**: O navegador não pode acessar diretamente o sistema de arquivos

## 🔍 Solução de Problemas

### Servidor não inicia
```bash
# Verificar se Python está instalado
python --version

# Verificar se as dependências estão instaladas
pip list | findstr flask
pip list | findstr pywin32
```

### Área de transferência não funciona
- Certifique-se que `pyperclip` está instalado: `pip install pyperclip`

### Atalhos não são criados
- Certifique-se que `pywin32` está instalado: `pip install pywin32`
- Execute como administrador se necessário
- Verifique se os caminhos estão corretos

### Interface não carrega
- Verifique se o servidor está rodando em `http://localhost:5000`
- Tente um navegador diferente
- Verifique se não há firewall bloqueando a porta 5000

## 📁 Estrutura de Arquivos Web

```
CriadorDeAtalhos/
├── web_app.py              # Aplicação Flask principal
├── start-web.bat           # Script de inicialização (Windows)
├── start-web.ps1           # Script de inicialização (PowerShell)
├── templates/
│   └── index.html          # Interface web principal
├── static/
│   ├── css/
│   │   └── style.css       # Estilos da interface
│   ├── js/
│   │   └── app.js          # JavaScript da aplicação
│   └── favicon.ico         # Ícone da aplicação
└── requirements.txt        # Dependências Python
```

## 🎨 Personalização

### Modificar Estilos
Edite `static/css/style.css` para personalizar a aparência.

### Modificar Funcionalidade
Edite `static/js/app.js` para personalizar o comportamento da interface.

### Modificar Backend
Edite `web_app.py` para adicionar novas APIs ou modificar a lógica.

## 🤝 Comparação com Outras Versões

| Característica | Web | Python Desktop | C# Desktop |
|----------------|-----|----------------|------------|
| **Interface** | Web moderna | Tkinter | WinForms |
| **Tamanho** | ~5-10 MB | ~10-20 MB | ~70-90 MB |
| **Acesso** | Navegador | Aplicativo | Aplicativo |
| **Portabilidade** | Servidor local | Executável | Executável |
| **Funcionalidade** | Completa | Completa | Completa |
| **Navegação de arquivos** | Manual | Nativa | Nativa |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.