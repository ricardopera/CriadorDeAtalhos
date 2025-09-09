# 🔗 Criador de Atalhos

Uma aplicação Windows simples para criar atalhos de arquivos e diretórios.

## 📋 Versões Disponíveis

| Versão | Tecnologia | Tamanho | Acesso | Descrição |
|--------|------------|---------|---------|-----------|
| **🌐 Web** | JavaScript + HTML5 | ~50KB | [**Acesse Agora**](https://ricardopera.github.io/CriadorDeAtalhos/web/) | **Novidade!** Execute no navegador, sem instalação |
| **C# Original** | .NET 6 WinForms | ~70-90 MB | `main` branch | Versão original completa para Windows |
| **Python Reduzida** | Python + tkinter | ~10-20 MB | `python-implementation` branch | Versão otimizada para tamanho reduzido |

> 🌟 **Novidade**: A **versão Web** está disponível! Acesse diretamente pelo navegador sem precisar instalar nada. [**Clique aqui para testar**](https://ricardopera.github.io/CriadorDeAtalhos/web/)

> 💡 **Recomendação**: Use a **versão Web** para acesso instantâneo, ou a versão Python para instalação local com menor tamanho.

## 🎯 Funcionalidades

### 🌐 **Versão Web** (Recomendada - Sem Instalação)
- **Acesso instantâneo**: Execute diretamente no navegador
- **Sem instalação**: Não precisa baixar ou instalar nada
- **Multiplataforma**: Funciona em Windows, Mac, Linux, mobile
- **Duas opções**: Gera arquivos .lnk ou scripts VBS
- **Segurança total**: Processamento 100% local, nenhum dado sai do seu navegador
- **Interface moderna**: Design responsivo e acessível

**🚀 [Acesse a Versão Web Agora](https://ricardopera.github.io/CriadorDeAtalhos/web/)**

### 💻 **Versões Desktop** (Windows)
- **Interface gráfica intuitiva**: Interface Windows Forms limpa e fácil de usar
- **Seleção de arquivos e pastas**: Botões dedicados para selecionar arquivos ou diretórios
- **Detecção automática da área de transferência**: Detecta automaticamente caminhos copiados
- **Destinos flexíveis**: Crie atalhos na Área de Trabalho ou em local personalizado
- **Validação em tempo real**: Verifica se os caminhos são válidos antes de criar o atalho
- **Prevenção de conflitos**: Adiciona numeração automática se já existir um atalho com o mesmo nome

## 🚀 Como usar

### 🌐 **Versão Web** (Mais Fácil)

1. **Acesse**: [https://ricardopera.github.io/CriadorDeAtalhos/web/](https://ricardopera.github.io/CriadorDeAtalhos/web/)
2. **Digite o caminho**: Cole ou digite o caminho completo do arquivo/pasta
3. **Escolha o destino**: Área de Trabalho, Downloads ou local personalizado  
4. **Crie**: Clique em "Criar Atalho" ou "Gerar Script VBS"
5. **Use**: Baixe o arquivo gerado e use conforme as instruções

**📖 Documentação completa**: [README-WEB.md](README-WEB.md)

### 💻 **Versão Desktop**

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

### 🌐 **Versão Web**
- **Navegador moderno**: Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+
- **Internet**: Apenas para carregar a página inicial (funciona offline depois)
- **Sistema**: Qualquer (Windows, Mac, Linux, Android, iOS)

### 💻 **Versões Desktop**  
- Windows 10 ou superior
- .NET 6.0 Runtime (versão C#) ou Python 3.8+ (versão Python)

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

### 🌐 **Versão Web**
- `web/index.html`: Interface web principal
- `web/css/style.css`: Estilos responsivos
- `web/js/`: Scripts JavaScript (geração .lnk, VBS, clipboard)
- `README-WEB.md`: Documentação da versão web

### 💻 **Versões Desktop**
- `Program.cs`: Ponto de entrada da aplicação C#
- `MainForm.cs`: Interface principal e lógica da aplicação C#
- `criador_atalhos.py`: Implementação Python completa
- `ShortcutCreator.csproj`: Arquivo de projeto C#

## 🛡️ Características Técnicas

- Utiliza APIs COM do Windows para criar atalhos nativos (.lnk)
- Interface responsiva com validação em tempo real
- Tratamento de erros robusto
- Suporte a DPI alto
- Prevenção automática de conflitos de nomes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.