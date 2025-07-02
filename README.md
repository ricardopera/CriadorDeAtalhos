# 🔗 Criador de Atalhos

Uma aplicação Windows simples para criar atalhos de arquivos e diretórios.

## 📋 Versões Disponíveis

| Versão | Tecnologia | Tamanho | Branch | Descrição |
|--------|------------|---------|---------|-----------|
| **C# Original** | .NET 6 WinForms | ~70-90 MB | `main` | Versão original completa |
| **Python Reduzida** | Python + tkinter | ~10-20 MB | `python-implementation` | Versão otimizada para tamanho reduzido |

> 💡 **Recomendação**: Use a versão Python para downloads mais rápidos e menor uso de espaço. Ambas possuem **funcionalidades idênticas**.

## 🎯 Funcionalidades

- **Interface gráfica intuitiva**: Interface Windows Forms limpa e fácil de usar
- **Seleção de arquivos e pastas**: Botões dedicados para selecionar arquivos ou diretórios
- **Detecção automática da área de transferência**: Detecta automaticamente caminhos copiados
- **Destinos flexíveis**: Crie atalhos na Área de Trabalho ou em local personalizado
- **Validação em tempo real**: Verifica se os caminhos são válidos antes de criar o atalho
- **Prevenção de conflitos**: Adiciona numeração automática se já existir um atalho com o mesmo nome

## 🚀 Como usar

1. **Selecionar origem**:
   - Use "Selecionar Arquivo" para escolher um arquivo específico
   - Use "Selecionar Pasta" para escolher um diretório
   - Use "Detectar da Área de Transferência" se você copiou um caminho

2. **Escolher destino**:
   - Marque "Área de Trabalho" para criar o atalho na área de trabalho
   - Marque "Destino personalizado" e selecione uma pasta específica

3. **Criar atalho**:
   - Clique em "Criar Atalho" quando os campos estiverem válidos
   - A aplicação perguntará se você deseja abrir a pasta onde o atalho foi criado

## 💻 Requisitos

- Windows 10 ou superior
- .NET 6.0 Runtime

## 🔧 Compilação

### Versão Python (Recomendada - Executável Reduzido)

Para compilar a versão otimizada em Python (~10-20 MB):

**Windows Command Prompt:**
```cmd
git checkout python-implementation
build-python.bat
```

**Windows PowerShell:**
```powershell
git checkout python-implementation
.\build-python.ps1
```

📖 **Documentação completa**: [README-PYTHON.md](README-PYTHON.md)

### Versão C# Original

Para compilar a versão original em C# (~70-90 MB):

### Build Rápido (Recomendado)

Para compilar e criar o executável autocontido rapidamente, use os scripts fornecidos:

**Windows Command Prompt:**
```cmd
build.bat
```

**Windows PowerShell:**
```powershell
.\build.ps1
```

### Build Manual

Para compilar a aplicação manualmente:

```bash
dotnet build --configuration Release
```

Para criar um executável auto-contido de arquivo único:

```bash
dotnet publish --configuration Release --self-contained true --runtime win-x64 --property:PublishSingleFile=true --output ./publish
```

### Automatização com GitHub Actions

O projeto inclui um workflow do GitHub Actions que automaticamente:
- Compila o código quando uma tag é criada
- Cria executável autocontido de arquivo único
- Gera release com arquivo ZIP
- Publica automaticamente no GitHub Releases

Para mais detalhes, veja [RELEASE_NOTES.md](RELEASE_NOTES.md).

## 📋 Estrutura do Projeto

- `Program.cs`: Ponto de entrada da aplicação
- `MainForm.cs`: Interface principal e lógica da aplicação
- `ShortcutCreator.csproj`: Arquivo de projeto

## 🛡️ Características Técnicas

- Utiliza APIs COM do Windows para criar atalhos nativos (.lnk)
- Interface responsiva com validação em tempo real
- Tratamento de erros robusto
- Suporte a DPI alto
- Prevenção automática de conflitos de nomes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.