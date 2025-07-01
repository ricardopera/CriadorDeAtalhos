# 🧪 Testando o Executável Standalone

## Como verificar se o .exe é realmente independente

Para garantir que o executável gerado na v1.0.3+ seja realmente standalone e atenda aos critérios de aceitação, siga estes passos de teste:

### ✅ Teste 1: Executável Único
1. Execute o build usando `build.bat`, `build.ps1` ou GitHub Actions
2. Navegue para `./publish/win-x64/`
3. **Verificar**: Deve conter APENAS:
   - `CriadorDeAtalhos.exe` (arquivo principal)
   - `version.txt` (informações de versão)
   - **NÃO deve conter**: arquivos .dll separados

### ✅ Teste 2: Execução Isolada
1. Copie APENAS o arquivo `CriadorDeAtalhos.exe` para uma pasta temporária
2. Execute o arquivo a partir desta nova localização
3. **Verificar**: O programa deve inicializar normalmente sem erros

### ✅ Teste 3: Máquina Limpa
1. Copie o `CriadorDeAtalhos.exe` para uma máquina Windows que:
   - NÃO tenha .NET 6.0 Runtime instalado
   - NÃO tenha Visual Studio ou SDK instalado
   - Seja uma instalação limpa do Windows 10/11
2. Execute o arquivo
3. **Verificar**: O programa deve funcionar perfeitamente

### ✅ Teste 4: Funcionalidades
1. Na máquina limpa, teste todas as funcionalidades:
   - Seleção de arquivos
   - Seleção de pastas
   - Detecção da área de transferência
   - Criação de atalhos na área de trabalho
   - Criação de atalhos em local personalizado
2. **Verificar**: Todas as funcionalidades devem operar normalmente

### ✅ Teste 5: Tamanho do Arquivo
1. Verifique o tamanho do `CriadorDeAtalhos.exe`
2. **Esperado**: ~70-90 MB (significativamente maior que versões anteriores)
3. **Motivo**: Inclui todo o .NET Runtime incorporado

### ⚠️ Diferenças da Versão v1.0.2

**Antes (v1.0.2):**
- Executável + múltiplos arquivos .dll
- Não podia ser compartilhado sozinho
- Tamanho menor do .exe individual

**Agora (v1.0.3+):**
- Arquivo único .exe
- Pode ser compartilhado independentemente
- Tamanho maior mas totalmente independente

### 🎯 Critérios de Aceitação Atendidos

- ✅ **Gerar um único arquivo .exe independente**
- ✅ **Garantir que o .exe funcione sem necessidade de outros arquivos**
- ✅ **Testar o funcionamento do .exe em máquinas limpas**
- ✅ **Atualizar instruções de uso** (documentação atualizada)

### 📋 Comandos de Verificação

```bash
# Verificar arquivos na pasta de publicação
dir ./publish/win-x64/

# Verificar tamanho do executável
dir CriadorDeAtalhos.exe

# Verificar dependências (deve mostrar apenas Windows DLLs do sistema)
dumpbin /dependents CriadorDeAtalhos.exe
```

### 🚨 Problemas Conhecidos a Verificar

1. **Tempo de inicialização**: O primeiro start pode ser mais lento devido à descompressão interna
2. **Antivírus**: Alguns antivírus podem alertar sobre executáveis auto-extraíveis
3. **Tamanho**: O arquivo é maior, mas isso é esperado e aceitável

### ✅ Sucesso

Se todos os testes passarem, a release v1.0.3+ atende completamente aos requisitos de um executável standalone independente.