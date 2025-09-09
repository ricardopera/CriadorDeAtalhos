// Criador de Atalhos - Web Version JavaScript

class ShortcutCreatorApp {
    constructor() {
        this.elements = {};
        this.systemInfo = {};
        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.loadSystemInfo();
    }

    initializeElements() {
        // Input elements
        this.elements.sourcePath = document.getElementById('source-path');
        this.elements.customDestination = document.getElementById('custom-destination');
        this.elements.customName = document.getElementById('custom-name');
        
        // Button elements
        this.elements.browseFile = document.getElementById('browse-file');
        this.elements.browseFolder = document.getElementById('browse-folder');
        this.elements.detectClipboard = document.getElementById('detect-clipboard');
        this.elements.browseDestination = document.getElementById('browse-destination');
        this.elements.createShortcut = document.getElementById('create-shortcut');
        
        // Radio buttons
        this.elements.destinationRadios = document.querySelectorAll('input[name="destination"]');
        
        // Status and modals
        this.elements.statusMessage = document.getElementById('status-message');
        this.elements.successModal = document.getElementById('success-modal');
        this.elements.errorModal = document.getElementById('error-modal');
        
        // Hidden file inputs
        this.elements.fileInput = document.getElementById('file-input');
        this.elements.folderInput = document.getElementById('folder-input');
        this.elements.destinationInput = document.getElementById('destination-input');
        
        // Custom destination container
        this.elements.customDestinationContainer = document.querySelector('.custom-destination-container');
        
        // System info
        this.elements.systemStatus = document.getElementById('system-status');
    }

    bindEvents() {
        // Input validation
        this.elements.sourcePath.addEventListener('input', () => this.validateInput());
        this.elements.customDestination.addEventListener('input', () => this.validateInput());
        
        // Button events
        this.elements.browseFile.addEventListener('click', () => this.browseFile());
        this.elements.browseFolder.addEventListener('click', () => this.browseFolder());
        this.elements.detectClipboard.addEventListener('click', () => this.detectClipboard());
        this.elements.browseDestination.addEventListener('click', () => this.browseDestination());
        this.elements.createShortcut.addEventListener('click', () => this.createShortcut());
        
        // Radio button changes
        this.elements.destinationRadios.forEach(radio => {
            radio.addEventListener('change', () => this.onDestinationChange());
        });
        
        // File input changes
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        this.elements.folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));
        this.elements.destinationInput.addEventListener('change', (e) => this.handleDestinationSelection(e));
        
        // Modal events
        this.bindModalEvents();
        
        // Path validation on paste/input
        this.elements.sourcePath.addEventListener('paste', () => {
            setTimeout(() => this.validatePath(this.elements.sourcePath.value), 100);
        });
    }

    bindModalEvents() {
        // Success modal
        const successModal = this.elements.successModal;
        const closeButtons = successModal.querySelectorAll('.modal-close, #modal-ok');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(successModal));
        });
        
        // Open location button
        document.getElementById('open-location').addEventListener('click', () => {
            this.openShortcutLocation();
        });
        
        // Error modal
        const errorModal = this.elements.errorModal;
        const errorCloseButtons = errorModal.querySelectorAll('.modal-close, .btn');
        errorCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(errorModal));
        });
        
        // Close modals when clicking outside
        [successModal, errorModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    async loadSystemInfo() {
        try {
            const response = await fetch('/api/system_info');
            const data = await response.json();
            this.systemInfo = data;
            
            let statusText = `Sistema: ${data.platform}`;
            if (data.platform !== 'win32') {
                statusText += ' ⚠️ Funcionalidade limitada';
            }
            if (!data.win32_available) {
                statusText += ' | pywin32: ❌';
            }
            if (!data.clipboard_available) {
                statusText += ' | clipboard: ❌';
            }
            
            this.elements.systemStatus.textContent = statusText;
            
        } catch (error) {
            this.elements.systemStatus.textContent = 'Erro ao carregar informações do sistema';
            console.error('Erro ao carregar informações do sistema:', error);
        }
    }

    browseFile() {
        // Note: Web browsers can't directly browse local files for security reasons
        // This is a limitation we need to inform users about
        this.showStatus('IMPORTANTE: Devido às limitações de segurança dos navegadores, você deve digitar ou colar manualmente o caminho completo do arquivo. Use Ctrl+L no Explorer para copiar o caminho.', 'warning');
    }

    browseFolder() {
        // Same limitation as above
        this.showStatus('IMPORTANTE: Digite ou cole manualmente o caminho completo da pasta. Use Ctrl+L no Explorer para copiar o caminho.', 'warning');
    }

    browseDestination() {
        this.showStatus('IMPORTANTE: Digite ou cole manualmente o caminho completo da pasta de destino.', 'warning');
    }

    async detectClipboard() {
        try {
            this.showStatus('Detectando conteúdo da área de transferência...', 'info');
            
            const response = await fetch('/api/get_clipboard');
            const data = await response.json();
            
            if (data.success) {
                this.elements.sourcePath.value = data.path;
                this.showStatus(data.message, 'success');
                this.validateInput();
            } else {
                this.showStatus(data.message, 'warning');
            }
        } catch (error) {
            this.showStatus('Erro ao acessar área de transferência', 'error');
            console.error('Erro ao detectar clipboard:', error);
        }
    }

    async validatePath(path) {
        if (!path || path.trim() === '') {
            return;
        }
        
        try {
            const response = await fetch('/api/validate_path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: path.trim() })
            });
            
            const data = await response.json();
            
            if (data.valid) {
                this.showStatus(data.message, 'success');
            } else {
                this.showStatus(data.message, 'error');
            }
            
            this.validateInput();
            
        } catch (error) {
            console.error('Erro ao validar caminho:', error);
        }
    }

    validateInput() {
        const sourcePath = this.elements.sourcePath.value.trim();
        const customDestination = this.elements.customDestination.value.trim();
        const isCustomDestination = document.querySelector('input[name="destination"]:checked').value === 'custom';
        
        // Basic validation
        let isValid = sourcePath !== '';
        
        if (isCustomDestination) {
            isValid = isValid && customDestination !== '';
        }
        
        this.elements.createShortcut.disabled = !isValid;
        
        // Clear status if inputs are being modified
        if (!isValid && this.elements.statusMessage.textContent) {
            setTimeout(() => {
                if (this.elements.sourcePath.value.trim() === '' || 
                    (isCustomDestination && this.elements.customDestination.value.trim() === '')) {
                    this.showStatus('Selecione um arquivo ou pasta para criar o atalho.', 'info');
                }
            }, 1000);
        }
    }

    onDestinationChange() {
        const selectedValue = document.querySelector('input[name="destination"]:checked').value;
        const isCustom = selectedValue === 'custom';
        
        // Show/hide custom destination container
        if (isCustom) {
            this.elements.customDestinationContainer.style.display = 'block';
            this.elements.customDestination.disabled = false;
            this.elements.browseDestination.disabled = false;
        } else {
            this.elements.customDestinationContainer.style.display = 'none';
            this.elements.customDestination.disabled = true;
            this.elements.browseDestination.disabled = true;
        }
        
        this.validateInput();
    }

    async createShortcut() {
        const sourcePath = this.elements.sourcePath.value.trim();
        const destinationType = document.querySelector('input[name="destination"]:checked').value;
        const customDestination = this.elements.customDestination.value.trim();
        const customName = this.elements.customName.value.trim();
        
        if (!sourcePath) {
            this.showStatus('Por favor, informe o caminho do arquivo ou pasta.', 'error');
            return;
        }
        
        if (destinationType === 'custom' && !customDestination) {
            this.showStatus('Por favor, informe o destino personalizado.', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        this.showStatus('Criando atalho...', 'info');
        
        try {
            const response = await fetch('/api/create_shortcut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_path: sourcePath,
                    destination_type: destinationType,
                    custom_destination: customDestination,
                    custom_name: customName
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccessModal(data.message, data.shortcut_path);
                this.showStatus(data.message, 'success');
            } else {
                this.showErrorModal(data.message);
                this.showStatus(data.message, 'error');
            }
            
        } catch (error) {
            const errorMessage = 'Erro ao criar atalho: ' + error.message;
            this.showErrorModal(errorMessage);
            this.showStatus(errorMessage, 'error');
            console.error('Erro ao criar atalho:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        const button = this.elements.createShortcut;
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (isLoading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.validateInput(); // Re-enable button based on validation
        }
    }

    showStatus(message, type = 'info') {
        const statusElement = this.elements.statusMessage;
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (statusElement.classList.contains('success')) {
                    statusElement.textContent = '';
                    statusElement.className = 'status-message';
                }
            }, 5000);
        }
    }

    showSuccessModal(message, shortcutPath) {
        document.getElementById('success-message').textContent = message;
        document.getElementById('shortcut-location').textContent = shortcutPath;
        this.shortcutPath = shortcutPath; // Store for opening location
        this.showModal(this.elements.successModal);
    }

    showErrorModal(message) {
        document.getElementById('error-message').textContent = message;
        this.showModal(this.elements.errorModal);
    }

    showModal(modal) {
        modal.style.display = 'flex';
        // Focus trap
        const firstFocusable = modal.querySelector('button');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    openShortcutLocation() {
        if (this.shortcutPath) {
            // This will only work on Windows with proper backend support
            window.open(`file:///${this.shortcutPath.replace(/\\/g, '/')}`, '_blank');
        }
    }

    // File input handlers (these won't work due to browser security restrictions)
    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file && file.path) {
            this.elements.sourcePath.value = file.path;
            this.validateInput();
        }
    }

    handleFolderSelection(event) {
        const files = event.target.files;
        if (files.length > 0 && files[0].webkitRelativePath) {
            const path = files[0].webkitRelativePath.split('/')[0];
            this.elements.sourcePath.value = path;
            this.validateInput();
        }
    }

    handleDestinationSelection(event) {
        const files = event.target.files;
        if (files.length > 0 && files[0].webkitRelativePath) {
            const path = files[0].webkitRelativePath.split('/')[0];
            this.elements.customDestination.value = path;
            this.validateInput();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShortcutCreatorApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Escape key to close modals
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="flex"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl+Enter to create shortcut
    if (event.ctrlKey && event.key === 'Enter') {
        const createButton = document.getElementById('create-shortcut');
        if (!createButton.disabled) {
            createButton.click();
        }
    }
});

// Add helpful tooltips and instructions
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltip for path input
    const sourcePathInput = document.getElementById('source-path');
    sourcePathInput.title = 'Dica: Use Ctrl+L no Explorer para copiar o caminho completo de um arquivo ou pasta';
    
    // Add instruction text
    const instructionText = document.createElement('div');
    instructionText.className = 'instruction-text';
    instructionText.innerHTML = `
        <p><strong>💡 Como usar:</strong></p>
        <ol>
            <li>No Windows Explorer, navegue até o arquivo ou pasta desejada</li>
            <li>Pressione <kbd>Ctrl+L</kbd> para selecionar a barra de endereços</li>
            <li>Copie o caminho com <kbd>Ctrl+C</kbd></li>
            <li>Cole aqui com <kbd>Ctrl+V</kbd></li>
            <li>Ou clique em "Detectar da Área de Transferência"</li>
        </ol>
    `;
    
    // Add instruction styles
    const style = document.createElement('style');
    style.textContent = `
        .instruction-text {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .instruction-text ol {
            margin: 10px 0 0 20px;
        }
        .instruction-text li {
            margin-bottom: 5px;
        }
        .instruction-text kbd {
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 2px 4px;
            font-size: 0.8rem;
            font-family: monospace;
        }
    `;
    document.head.appendChild(style);
    
    // Insert instruction before the first input group
    const firstInputGroup = document.querySelector('.input-group');
    firstInputGroup.parentNode.insertBefore(instructionText, firstInputGroup);
});