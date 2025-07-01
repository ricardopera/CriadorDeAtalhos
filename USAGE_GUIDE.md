# 🚀 Guia para Criar Nova Release

## ✅ Situação Atual

Foi criada toda a infraestrutura necessária para automatizar a criação de executáveis autocontidos de arquivo único e releases:

- **Versão atualizada**: 1.0.3.0 no arquivo `ShortcutCreator.csproj`
- **GitHub Actions**: Workflow completo para build automatizado
- **Scripts locais**: `build.bat` e `build.ps1` para builds manuais
- **Documentação**: `RELEASE_NOTES.md` com instruções detalhadas

## 🎯 Como Criar a Nova Release v1.0.3

### Opção 1: Automática (Recomendada)
1. No GitHub, vá em **Actions**
2. Selecione **"Build and Release"**
3. Clique em **"Run workflow"**
4. Configure:
   - ✅ Create a new release: **true**
   - 🏷️ Version tag: **v1.0.3**
5. Clique em **"Run workflow"**

**O que acontece:**
- ✅ Compila o código automaticamente no Windows
- 📦 Cria executável autocontido de arquivo único (win-x64)
- 🗜️ Gera arquivo ZIP
- 🚀 Publica release com descrição completa
- 📋 Inclui informações de build

### Opção 2: Manual (Necessário Windows)
1. Clone o repositório em uma máquina Windows
2. Execute `build.bat` ou `build.ps1`
3. Use o arquivo ZIP gerado para criar release manual

## 📁 O que será criado

**Executável de arquivo único incluirá:**
- `CriadorDeAtalhos.exe` - Aplicação principal com todas as dependências incorporadas
- `version.txt` - Informações de versão
- **Tamanho**: ~70-90 MB (ZIP ~30-40 MB)

**Requisitos do usuário final:**
- ✅ Windows 10 ou superior
- ✅ Arquitetura x64
- ❌ **NÃO precisa instalar .NET Runtime**
- ✅ **Arquivo ÚNICO - pode ser compartilhado independentemente**

## 🔄 Para próximas releases

1. Atualize a versão em `ShortcutCreator.csproj`
2. Atualize os scripts se necessário
3. Execute o workflow do GitHub Actions
4. Pronto! 🎉

## 📞 Suporte

Toda a documentação está em:
- `RELEASE_NOTES.md` - Processo detalhado
- `README.md` - Instruções atualizadas
- `TESTING_STANDALONE.md` - Guia para testar executável standalone
- `.github/workflows/build-and-release.yml` - Automação

**Status**: ✅ **Pronto para criar a release v1.0.3 com executável de arquivo único!**