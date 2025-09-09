/**
 * VBS Script Generator for Windows Shortcuts
 * Generates VBScript files that can create Windows shortcuts when executed
 */

class VbsGenerator {
    /**
     * Generates a VBS script that creates a Windows shortcut
     * @param {Object} options - Shortcut options
     * @param {string} options.target - Target path
     * @param {string} options.shortcutPath - Where to create the shortcut
     * @param {string} [options.workingDirectory] - Working directory
     * @param {string} [options.description] - Description
     * @param {string} [options.arguments] - Arguments
     * @returns {string} VBS script content
     */
    generate(options) {
        const {
            target,
            shortcutPath,
            workingDirectory = this.getParentDirectory(target),
            description = `Shortcut to ${this.getFileName(target)}`,
            arguments: args = ''
        } = options;

        // Escape quotes in strings for VBS
        const escapeVbs = (str) => str.replace(/"/g, '""');

        const vbsScript = `' Shortcut Creator - Generated VBS Script
' Este script cria um atalho do Windows
' Execute clicando duas vezes neste arquivo

Option Explicit

Dim WshShell, oShellLink
Dim strTarget, strShortcut, strWorkingDir, strDescription, strArguments

' Configurações do atalho
strTarget = "${escapeVbs(target)}"
strShortcut = "${escapeVbs(shortcutPath)}"
strWorkingDir = "${escapeVbs(workingDirectory)}"
strDescription = "${escapeVbs(description)}"
strArguments = "${escapeVbs(args)}"

' Criar objeto Shell
Set WshShell = CreateObject("WScript.Shell")

' Verificar se o arquivo/pasta de destino existe
If Not (CreateObject("Scripting.FileSystemObject").FileExists(strTarget) Or CreateObject("Scripting.FileSystemObject").FolderExists(strTarget)) Then
    MsgBox "Erro: O arquivo ou pasta de destino não foi encontrado:" & vbCrLf & strTarget, vbCritical, "Erro"
    WScript.Quit 1
End If

' Criar diretório de destino se não existir
Dim fso, shortcutDir
Set fso = CreateObject("Scripting.FileSystemObject")
shortcutDir = fso.GetParentFolderName(strShortcut)
If Not fso.FolderExists(shortcutDir) Then
    On Error Resume Next
    fso.CreateFolder(shortcutDir)
    If Err.Number <> 0 Then
        MsgBox "Erro: Não foi possível criar o diretório:" & vbCrLf & shortcutDir, vbCritical, "Erro"
        WScript.Quit 1
    End If
    On Error Goto 0
End If

' Criar o atalho
Set oShellLink = WshShell.CreateShortcut(strShortcut)
oShellLink.TargetPath = strTarget
oShellLink.WorkingDirectory = strWorkingDir
oShellLink.Description = strDescription
If Len(strArguments) > 0 Then
    oShellLink.Arguments = strArguments
End If
oShellLink.WindowStyle = 1 ' Normal window

' Salvar o atalho
On Error Resume Next
oShellLink.Save
If Err.Number <> 0 Then
    MsgBox "Erro ao criar o atalho:" & vbCrLf & Err.Description, vbCritical, "Erro"
    WScript.Quit 1
End If
On Error Goto 0

' Perguntar se deseja abrir a pasta do atalho
Dim result
result = MsgBox("Atalho criado com sucesso!" & vbCrLf & vbCrLf & "Local: " & strShortcut & vbCrLf & vbCrLf & "Deseja abrir a pasta onde o atalho foi criado?", vbQuestion + vbYesNo, "Sucesso")

If result = vbYes Then
    WshShell.Run "explorer.exe /select,""" & strShortcut & """", 1, False
End If

' Limpeza
Set oShellLink = Nothing
Set WshShell = Nothing
Set fso = Nothing

MsgBox "Script executado com sucesso!", vbInformation, "Concluído"`;

        return vbsScript;
    }

    /**
     * Generates a batch file that runs the VBS script
     * @param {string} vbsFilename - Name of the VBS file
     * @returns {string} Batch file content
     */
    generateBatch(vbsFilename) {
        return `@echo off
REM Shortcut Creator - Batch Runner
REM Este arquivo executa o script VBS para criar o atalho

echo.
echo ================================================
echo           Criador de Atalhos - VBS
echo ================================================
echo.
echo Executando script para criar atalho...
echo.

REM Execute o script VBS
cscript //NoLogo "${vbsFilename}"

echo.
echo Pressione qualquer tecla para continuar...
pause >nul`;
    }

    /**
     * Gets parent directory from a path
     */
    getParentDirectory(path) {
        if (!path) return '';
        
        // Normalize path separators
        const normalized = path.replace(/\//g, '\\');
        const lastSlash = normalized.lastIndexOf('\\');
        
        if (lastSlash === -1) {
            return '';
        }
        
        const parent = normalized.substring(0, lastSlash);
        
        // Handle drive root (e.g., "C:")
        if (parent.length === 2 && parent.endsWith(':')) {
            return parent + '\\';
        }
        
        return parent || '';
    }

    /**
     * Gets filename from a path
     */
    getFileName(path) {
        if (!path) return '';
        
        const normalized = path.replace(/\//g, '\\');
        const lastSlash = normalized.lastIndexOf('\\');
        
        if (lastSlash === -1) {
            return path;
        }
        
        return normalized.substring(lastSlash + 1);
    }

    /**
     * Downloads the VBS script file
     */
    download(vbsContent, filename) {
        const blob = new Blob([vbsContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.vbs') ? filename : `${filename}.vbs`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /**
     * Downloads both VBS and BAT files as a ZIP
     */
    async downloadZip(vbsContent, batContent, baseName) {
        // Simple ZIP file creation for two files
        // This is a minimal implementation - for production, consider using a proper ZIP library
        
        const vbsBlob = new Blob([vbsContent], { type: 'text/plain' });
        const batBlob = new Blob([batContent], { type: 'text/plain' });
        
        // For now, just download the VBS file
        // In a full implementation, you might want to use JSZip library
        this.download(vbsContent, `${baseName}.vbs`);
        
        // Also offer the batch file
        setTimeout(() => {
            const url = URL.createObjectURL(batBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName}.bat`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 500);
    }
}