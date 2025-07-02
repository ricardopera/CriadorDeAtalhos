# 📖 Guia de Uso - Implementação Python

## 🚀 Como Usar a Versão Python (Executável Reduzido)

### 1️⃣ Mudança para a Branch Python

```bash
git checkout python-implementation
```

### 2️⃣ Compilação do Executável

**Opção A: Script Automático (Recomendado)**
```cmd
# Windows Command Prompt
build-python.bat

# ou PowerShell
.\build-python.ps1
```

**Opção B: Comandos Manuais**
```bash
# Instalar dependências
pip install pyinstaller
pip install -r requirements.txt

# Criar executável
pyinstaller --onefile --windowed --name "CriadorDeAtalhos" --icon="favicon.ico" criador_atalhos.py
```

### 3️⃣ Resultado da Compilação

Após a compilação bem-sucedida:
- 📁 **Executável**: `./publish/python-win-x64/CriadorDeAtalhos.exe`
- 📦 **ZIP**: `./CriadorDeAtalhos-v1.0.3-py-win-x64.zip`
- 📄 **Informações**: `./publish/python-win-x64/version.txt`

### 4️⃣ Uso do Executável

1. **Execute** `CriadorDeAtalhos.exe`
2. **Selecione** arquivo ou pasta:
   - Clique "Selecionar Arquivo" ou "Selecionar Pasta"
   - Ou use "Detectar da Área de Transferência"
3. **Escolha o destino**:
   - Área de Trabalho (padrão)
   - Local personalizado
4. **Clique** "Criar Atalho"
5. **Confirme** se deseja abrir a pasta

### 5️⃣ Release Automático (GitHub Actions)

1. Acesse **Actions** no repositório
2. Selecione **"Build and Release - Python Implementation"**
3. Clique **"Run workflow"**
4. Configure:
   - **Create release**: `true`
   - **Version tag**: `v1.0.3-py`
5. **Execute** o workflow

### 📊 Resultados Esperados

| Característica | Valor |
|----------------|-------|
| **Tamanho final** | ~10-20 MB |
| **Redução** | 75-80% vs C# |
| **Download time** | ~2-4 segundos |
| **Inicialização** | Rápida |
| **Compatibilidade** | Windows 10+ x64 |

### 🔧 Pré-requisitos de Desenvolvimento

Para compilar localmente:
- ✅ Windows 10 ou superior
- ✅ Python 3.8+ instalado
- ✅ pip (gerenciador de pacotes)
- ✅ Git (para clone do repositório)

### 🧪 Teste da Implementação

```bash
# Verificar se tudo está ok
python test_python_implementation.py

# Comparar implementações
python compare_implementations.py
```

### ❓ Solução de Problemas

**Erro: "PyInstaller não encontrado"**
```bash
pip install pyinstaller
```

**Erro: "pywin32 não encontrado"**
```bash
pip install pywin32
```

**Erro: "Python não encontrado"**
- Instale Python 3.8+ do site oficial
- Adicione Python ao PATH

**Executável muito grande**
- Verifique se usou `--onefile`
- Confirme que não há dependências extras

### 🎯 Funcionalidades Validadas

✅ **Interface idêntica** ao original C#  
✅ **Seleção de arquivos** via diálogo  
✅ **Seleção de pastas** via navegador  
✅ **Área de transferência** detectada automaticamente  
✅ **Destinos flexíveis** (Desktop/Personalizado)  
✅ **Validação em tempo real** dos campos  
✅ **Prevenção de conflitos** com numeração  
✅ **Atalhos .lnk nativos** do Windows  
✅ **Abertura automática** da pasta destino  
✅ **Link GitHub** funcional  

---

**🎉 Parabéns!** Você agora tem um executável **75-80% menor** com **100% das funcionalidades**!