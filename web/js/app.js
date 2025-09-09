/**
 * Main Application Logic for Web Shortcut Creator
 * Coordinates the UI, clipboard access, and file generation
 */

class ShortcutCreatorApp {
    constructor() {
        this.lnkGenerator = new LnkGenerator();
        this.vbsGenerator = new VbsGenerator();
        this.clipboardUtils = new ClipboardUtils();
        
        this.elements = {};
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateUI();
        this.checkClipboardSupport();
    }

    /**
     * Bind DOM elements to properties
     */
    bindElements() {
        this.elements = {
            sourcePath: document.getElementById('source-path'),
            fileInput: document.getElementById('file-input'),
            folderInput: document.getElementById('folder-input'),
            browseFileBtn: document.getElementById('browse-file-btn'),
            browseFolderBtn: document.getElementById('browse-folder-btn'),
            detectClipboardBtn: document.getElementById('detect-clipboard-btn'),
            customDestination: document.getElementById('custom-destination'),
            browseDestinationBtn: document.getElementById('browse-destination-btn'),
            createShortcutBtn: document.getElementById('create-shortcut-btn'),
            createScriptBtn: document.getElementById('create-script-btn'),
            status: document.getElementById('status'),
            destinationRadios: document.querySelectorAll('input[name="destination"]')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Source path input
        this.elements.sourcePath.addEventListener('input', () => this.validateInput());
        this.elements.sourcePath.addEventListener('paste', (e) => {
            // Handle pasted paths
            setTimeout(() => this.validateInput(), 10);
        });

        // File/folder selection
        this.elements.browseFileBtn.addEventListener('click', () => this.browseFile());
        this.elements.browseFolderBtn.addEventListener('click', () => this.browseFolder());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        this.elements.folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));

        // Clipboard detection
        this.elements.detectClipboardBtn.addEventListener('click', () => this.detectClipboard());

        // Destination selection
        this.elements.destinationRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateDestinationUI());
        });
        this.elements.customDestination.addEventListener('input', () => this.validateInput());
        this.elements.browseDestinationBtn.addEventListener('click', () => this.browseDestination());

        // Creation buttons
        this.elements.createShortcutBtn.addEventListener('click', () => this.createShortcut());
        this.elements.createScriptBtn.addEventListener('click', () => this.createScript());
    }

    /**
     * Check clipboard support and update UI accordingly
     */
    checkClipboardSupport() {
        if (!this.clipboardUtils.isAvailable()) {
            this.elements.detectClipboardBtn.title = 'Requer HTTPS e navegador moderno';
            this.setStatus('⚠️ Detecção da área de transferência requer HTTPS', 'warning');
        }
    }

    /**
     * Browse for a file
     */
    browseFile() {
        this.elements.fileInput.click();
    }

    /**
     * Browse for a folder
     */
    browseFolder() {
        this.elements.folderInput.click();
    }

    /**
     * Handle file selection from input
     */
    handleFileSelection(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            // Note: In browsers, we can only get the name and relative path for security reasons
            // User will need to input the full path manually
            this.setStatus('⚠️ Arquivo selecionado. Insira o caminho completo no campo acima.', 'warning');
            this.elements.sourcePath.focus();
        }
    }

    /**
     * Handle folder selection from input
     */
    handleFolderSelection(event) {
        const files = event.target.files;
        if (files.length > 0) {
            // For folder input, we get the files in the folder
            const firstFile = files[0];
            // Extract the directory path (remove filename)
            this.setStatus('⚠️ Pasta selecionada. Insira o caminho completo no campo acima.', 'warning');
            this.elements.sourcePath.focus();
        }
    }

    /**
     * Browse for destination folder
     */
    browseDestination() {
        // For now, just focus the input - browser security doesn't allow direct folder access
        this.elements.customDestination.focus();
        this.setStatus('💡 Digite o caminho completo da pasta de destino', 'info');
    }

    /**
     * Detect content from clipboard
     */
    async detectClipboard() {
        try {
            this.setStatus('🔍 Verificando área de transferência...', 'info');
            
            const clipboardText = await this.clipboardUtils.getText();
            
            if (!clipboardText) {
                this.setStatus('📋 Área de transferência está vazia', 'warning');
                return;
            }

            const cleanPath = this.clipboardUtils.cleanPath(clipboardText);
            
            if (this.clipboardUtils.isValidPath(cleanPath)) {
                this.elements.sourcePath.value = cleanPath;
                this.setStatus('✅ Caminho detectado da área de transferência!', 'success');
                this.validateInput();
            } else {
                this.setStatus('⚠️ Conteúdo da área de transferência não parece ser um caminho válido', 'warning');
            }
        } catch (error) {
            console.error('Clipboard detection failed:', error);
            this.setStatus('❌ Erro ao acessar área de transferência: ' + error.message, 'error');
        }
    }

    /**
     * Update destination UI based on radio selection
     */
    updateDestinationUI() {
        const selectedDestination = document.querySelector('input[name="destination"]:checked').value;
        const isCustom = selectedDestination === 'custom';
        
        this.elements.customDestination.disabled = !isCustom;
        this.elements.browseDestinationBtn.disabled = !isCustom;
        
        if (!isCustom) {
            this.elements.customDestination.value = '';
        }
        
        this.validateInput();
    }

    /**
     * Validate all inputs and update UI state
     */
    validateInput() {
        const sourcePath = this.elements.sourcePath.value.trim();
        const selectedDestination = document.querySelector('input[name="destination"]:checked').value;
        const customDestination = this.elements.customDestination.value.trim();
        
        let isValidSource = this.isValidPath(sourcePath);
        let isValidDestination = true;
        
        if (selectedDestination === 'custom') {
            isValidDestination = this.isValidPath(customDestination);
        }
        
        const canCreate = isValidSource && isValidDestination;
        
        this.elements.createShortcutBtn.disabled = !canCreate;
        this.elements.createScriptBtn.disabled = !canCreate;
        
        // Update status based on validation
        if (!sourcePath) {
            this.setStatus('Selecione um arquivo ou pasta para criar o atalho.', 'info');
        } else if (!isValidSource) {
            this.setStatus('⚠️ Caminho de origem inválido ou formato incorreto', 'warning');
        } else if (selectedDestination === 'custom' && !isValidDestination) {
            this.setStatus('⚠️ Caminho de destino personalizado inválido', 'warning');
        } else if (canCreate) {
            this.setStatus('✅ Pronto para criar atalho!', 'success');
        }
    }

    /**
     * Check if a path looks valid
     */
    isValidPath(path) {
        return this.clipboardUtils.isValidPath(path);
    }

    /**
     * Create and download .lnk shortcut file
     */
    async createShortcut() {
        try {
            const sourcePath = this.elements.sourcePath.value.trim();
            const selectedDestination = document.querySelector('input[name="destination"]:checked').value;
            const customDestination = this.elements.customDestination.value.trim();
            
            this.setStatus('🔄 Gerando arquivo de atalho...', 'info');
            
            // Generate shortcut filename
            const fileName = this.getFileName(sourcePath);
            const shortcutName = fileName || 'Atalho';
            
            // Create .lnk file
            const lnkData = this.lnkGenerator.create({
                target: sourcePath,
                description: `Atalho para ${fileName}`
            });
            
            // Download the file
            this.lnkGenerator.download(lnkData, shortcutName);
            
            this.setStatus('✅ Arquivo de atalho gerado e baixado!', 'success');
            
            // Show additional info
            setTimeout(() => {
                this.showSuccessModal('lnk', {
                    filename: `${shortcutName}.lnk`,
                    destination: selectedDestination === 'desktop' ? 'Área de Trabalho' : 
                                selectedDestination === 'downloads' ? 'Downloads' : customDestination
                });
            }, 500);
            
        } catch (error) {
            console.error('Error creating shortcut:', error);
            this.setStatus('❌ Erro ao gerar atalho: ' + error.message, 'error');
        }
    }

    /**
     * Create and download VBS script
     */
    async createScript() {
        try {
            const sourcePath = this.elements.sourcePath.value.trim();
            const selectedDestination = document.querySelector('input[name="destination"]:checked').value;
            const customDestination = this.elements.customDestination.value.trim();
            
            this.setStatus('🔄 Gerando script VBS...', 'info');
            
            // Determine destination path
            let destinationPath;
            if (selectedDestination === 'desktop') {
                destinationPath = '%USERPROFILE%\\Desktop';
            } else if (selectedDestination === 'downloads') {
                destinationPath = '%USERPROFILE%\\Downloads';
            } else {
                destinationPath = customDestination;
            }
            
            const fileName = this.getFileName(sourcePath);
            const shortcutName = fileName || 'Atalho';
            const fullShortcutPath = `${destinationPath}\\${shortcutName}.lnk`;
            
            // Generate VBS script
            const vbsContent = this.vbsGenerator.generate({
                target: sourcePath,
                shortcutPath: fullShortcutPath,
                description: `Atalho para ${fileName}`
            });
            
            // Generate batch file
            const batContent = this.vbsGenerator.generateBatch(`${shortcutName}.vbs`);
            
            // Download files
            this.vbsGenerator.download(vbsContent, `${shortcutName}`);
            
            this.setStatus('✅ Script VBS gerado e baixado!', 'success');
            
            // Show additional info
            setTimeout(() => {
                this.showSuccessModal('vbs', {
                    filename: `${shortcutName}.vbs`,
                    target: sourcePath,
                    destination: destinationPath
                });
            }, 500);
            
        } catch (error) {
            console.error('Error creating script:', error);
            this.setStatus('❌ Erro ao gerar script: ' + error.message, 'error');
        }
    }

    /**
     * Show success modal with instructions
     */
    showSuccessModal(type, options) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        
        let content = '';
        if (type === 'lnk') {
            content = `
                <h3>✅ Atalho Criado com Sucesso!</h3>
                <p><strong>Arquivo baixado:</strong> ${options.filename}</p>
                <div class="instructions">
                    <h4>Como usar:</h4>
                    <ol>
                        <li>Localize o arquivo baixado na pasta de Downloads</li>
                        <li>Mova o arquivo <code>.lnk</code> para onde desejar (Área de Trabalho, pasta, etc.)</li>
                        <li>Clique duas vezes para testar o atalho</li>
                    </ol>
                </div>
            `;
        } else if (type === 'vbs') {
            content = `
                <h3>✅ Script Gerado com Sucesso!</h3>
                <p><strong>Arquivo baixado:</strong> ${options.filename}</p>
                <div class="instructions">
                    <h4>Como usar:</h4>
                    <ol>
                        <li>Localize o arquivo <code>.vbs</code> baixado</li>
                        <li>Clique duas vezes no arquivo para executar</li>
                        <li>O script criará automaticamente o atalho em: <br><code>${options.destination}</code></li>
                    </ol>
                    <p><strong>💡 Dica:</strong> Se aparecer um aviso de segurança, clique em "Executar" para continuar.</p>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="success-modal-content">
                ${content}
                <div class="success-modal-buttons">
                    <button id="close-success-modal" type="button">Entendi</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .success-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .success-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }
            
            .success-modal h3 {
                margin: 0 0 1rem 0;
                color: #28a745;
                font-size: 1.25rem;
            }
            
            .success-modal h4 {
                margin: 1rem 0 0.5rem 0;
                color: #495057;
                font-size: 1rem;
            }
            
            .success-modal p {
                margin: 0 0 1rem 0;
                color: #666;
            }
            
            .instructions {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 6px;
                margin: 1rem 0;
            }
            
            .instructions ol {
                margin: 0.5rem 0 0 0;
                padding-left: 1.5rem;
            }
            
            .instructions li {
                margin-bottom: 0.5rem;
                color: #495057;
            }
            
            .instructions code {
                background: #e9ecef;
                padding: 0.1rem 0.3rem;
                border-radius: 3px;
                font-size: 0.9em;
                color: #e83e8c;
            }
            
            .success-modal-buttons {
                display: flex;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }
            
            .success-modal button {
                background: #28a745;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.3s ease;
            }
            
            .success-modal button:hover {
                background: #218838;
            }
        `;
        
        modal.appendChild(style);
        document.body.appendChild(modal);
        
        // Close button
        const closeBtn = modal.querySelector('#close-success-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Extract filename from path
     */
    getFileName(path) {
        if (!path) return '';
        
        const normalized = path.replace(/\//g, '\\');
        const lastSlash = normalized.lastIndexOf('\\');
        
        if (lastSlash === -1) {
            return path;
        }
        
        const fileName = normalized.substring(lastSlash + 1);
        
        // Remove file extension for shortcut name
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot > 0) {
            return fileName.substring(0, lastDot);
        }
        
        return fileName;
    }

    /**
     * Set status message with styling
     */
    setStatus(message, type = 'info') {
        this.elements.status.textContent = message;
        this.elements.status.className = `status ${type}`;
    }

    /**
     * Update UI state
     */
    updateUI() {
        this.updateDestinationUI();
        this.validateInput();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShortcutCreatorApp();
});