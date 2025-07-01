# 📋 Notas de Release

## Como Criar uma Nova Release

### Método 1: Usar GitHub Actions (Recomendado)

1. Acesse a aba "Actions" no repositório GitHub
2. Selecione o workflow "Build and Release"
3. Clique em "Run workflow"
4. Preencha:
   - **Create a new release**: true
   - **Version tag**: v1.0.2 (ou a próxima versão)
5. Clique em "Run workflow"

O workflow irá:
- Compilar o código
- Criar executável autocontido para Windows x64
- Criar arquivo ZIP com o executável
- Criar uma nova release no GitHub automaticamente

### Método 2: Build Local + Release Manual

1. **No Windows**, execute um dos scripts de build:
   - `build.bat` (Command Prompt)
   - `build.ps1` (PowerShell)

2. Após o build bem-sucedido:
   - Vá para GitHub > Releases
   - Clique em "Create a new release"
   - Tag version: `v1.0.2`
   - Release title: `Release v1.0.2`
   - Anexe o arquivo ZIP gerado
   - Publique a release

### Método 3: Comandos Manuais

```bash
# Restaurar dependências
dotnet restore

# Compilar
dotnet build --configuration Release

# Criar executável autocontido
dotnet publish --configuration Release --self-contained true --runtime win-x64 --output ./publish/win-x64

# Criar ZIP (PowerShell)
Compress-Archive -Path "./publish/win-x64/*" -DestinationPath "./CriadorDeAtalhos-v1.0.2-win-x64.zip"
```

## Estrutura do Executável Autocontido

O executável autocontido inclui:
- `CriadorDeAtalhos.exe` - Executável principal
- Todas as DLLs necessárias do .NET Runtime
- `version.txt` - Informações de versão e build

## Histórico de Versões

### v1.0.2 (Em desenvolvimento)
- Adicionado processo automatizado de build e release
- Criados scripts de build para desenvolvimento local
- Melhorado documentação de release

### v1.0.1
- Adicionado nome do desenvolvedor "Ricardo Pereira" na interface

### v1.0.0
- Release inicial
- Interface gráfica para criação de atalhos
- Suporte a arquivos e diretórios
- Detecção automática da área de transferência

## Requisitos do Sistema

- **Sistema Operacional**: Windows 10 ou superior
- **Arquitetura**: x64
- **Dependências**: Nenhuma (executável autocontido)

## Tamanho Aproximado do Executável

- Executável autocontido: ~60-80 MB
- Arquivo ZIP: ~25-35 MB (compactado)

## Verificação de Integridade

Após o download, verifique:
1. O arquivo ZIP não está corrompido
2. O executável inicia corretamente
3. A versão mostrada corresponde à esperada
4. Todas as funcionalidades estão operacionais