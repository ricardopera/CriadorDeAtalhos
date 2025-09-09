/**
 * Clipboard Utilities for Browser
 * Handles clipboard access with fallbacks for different browser capabilities
 */

class ClipboardUtils {
    constructor() {
        this.isSecureContext = window.isSecureContext;
        this.hasClipboardAPI = navigator.clipboard && navigator.clipboard.readText;
    }

    /**
     * Checks if clipboard access is available
     * @returns {boolean} True if clipboard can be accessed
     */
    isAvailable() {
        return this.isSecureContext && this.hasClipboardAPI;
    }

    /**
     * Gets the current clipboard text content
     * @returns {Promise<string>} Clipboard text or empty string
     */
    async getText() {
        if (!this.isAvailable()) {
            throw new Error('Clipboard access not available. HTTPS is required.');
        }

        try {
            const text = await navigator.clipboard.readText();
            return text.trim();
        } catch (error) {
            console.warn('Clipboard read failed:', error);
            
            // Try fallback method (prompt user to paste)
            return this.promptForClipboard();
        }
    }

    /**
     * Writes text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} True if successful
     */
    async setText(text) {
        if (!this.isAvailable()) {
            return this.fallbackCopy(text);
        }

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Clipboard write failed:', error);
            return this.fallbackCopy(text);
        }
    }

    /**
     * Prompts user to manually paste clipboard content
     * @returns {Promise<string>} User pasted content
     */
    async promptForClipboard() {
        return new Promise((resolve) => {
            const modal = this.createPromptModal();
            document.body.appendChild(modal);

            const input = modal.querySelector('#clipboard-input');
            const confirmBtn = modal.querySelector('#confirm-paste');
            const cancelBtn = modal.querySelector('#cancel-paste');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            confirmBtn.addEventListener('click', () => {
                const value = input.value.trim();
                cleanup();
                resolve(value);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve('');
            });

            // Auto-focus input
            setTimeout(() => input.focus(), 100);
        });
    }

    /**
     * Creates a modal for manual clipboard input
     * @returns {HTMLElement} Modal element
     */
    createPromptModal() {
        const modal = document.createElement('div');
        modal.className = 'clipboard-modal';
        modal.innerHTML = `
            <div class="clipboard-modal-content">
                <h3>📋 Cole o conteúdo da área de transferência</h3>
                <p>Para detectar o caminho automaticamente, cole-o no campo abaixo:</p>
                <textarea id="clipboard-input" placeholder="Cole aqui o caminho do arquivo ou pasta..." rows="3"></textarea>
                <div class="clipboard-modal-buttons">
                    <button id="confirm-paste" type="button">Confirmar</button>
                    <button id="cancel-paste" type="button">Cancelar</button>
                </div>
                <p class="clipboard-help">
                    <small>💡 Dica: Copie o caminho no Windows Explorer usando Ctrl+C no endereço ou Shift+Clique direito → "Copiar como caminho"</small>
                </p>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .clipboard-modal {
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
            
            .clipboard-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .clipboard-modal h3 {
                margin: 0 0 1rem 0;
                color: #333;
            }
            
            .clipboard-modal p {
                margin: 0 0 1rem 0;
                color: #666;
            }
            
            .clipboard-modal textarea {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-family: monospace;
                font-size: 0.9rem;
                margin-bottom: 1rem;
                resize: vertical;
            }
            
            .clipboard-modal textarea:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .clipboard-modal-buttons {
                display: flex;
                gap: 0.5rem;
                justify-content: flex-end;
                margin-bottom: 1rem;
            }
            
            .clipboard-modal button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .clipboard-modal #confirm-paste {
                background: #667eea;
                color: white;
            }
            
            .clipboard-modal #cancel-paste {
                background: #f8f9fa;
                color: #495057;
                border: 1px solid #dee2e6;
            }
            
            .clipboard-help {
                font-size: 0.8rem !important;
                color: #888 !important;
                border-top: 1px solid #eee;
                padding-top: 1rem;
                margin: 0;
            }
        `;
        
        modal.appendChild(style);
        return modal;
    }

    /**
     * Fallback copy method using temporary element
     * @param {string} text - Text to copy
     * @returns {boolean} Success status
     */
    fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            return successful;
        } catch (error) {
            console.warn('Fallback copy failed:', error);
            return false;
        }
    }

    /**
     * Validates if text looks like a Windows path
     * @param {string} text - Text to validate
     * @returns {boolean} True if looks like a valid path
     */
    isValidPath(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }

        const trimmed = text.trim();
        
        // Check for common Windows path patterns
        const patterns = [
            /^[A-Za-z]:\\/, // C:\path
            /^\\\\[^\\]+\\/, // \\server\share
            /^[A-Za-z]:[^\\]/, // C:path (relative to drive)
        ];

        return patterns.some(pattern => pattern.test(trimmed));
    }

    /**
     * Cleans up a path string (removes quotes, normalizes separators)
     * @param {string} path - Path to clean
     * @returns {string} Cleaned path
     */
    cleanPath(path) {
        if (!path) return '';

        let cleaned = path.trim();
        
        // Remove surrounding quotes
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
        }
        
        // Normalize path separators to backslashes (Windows)
        cleaned = cleaned.replace(/\//g, '\\');
        
        // Remove trailing backslashes (except for drive roots)
        if (cleaned.length > 3) {
            cleaned = cleaned.replace(/\\+$/, '');
        }
        
        return cleaned;
    }

    /**
     * Shows a notification about clipboard capabilities
     * @param {string} type - Type of message ('error', 'warning', 'info')
     * @param {string} message - Message to show
     */
    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `clipboard-notification clipboard-${type}`;
        notification.textContent = message;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .clipboard-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem;
                border-radius: 6px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            }
            
            .clipboard-error { background: #dc3545; }
            .clipboard-warning { background: #ffc107; color: #212529; }
            .clipboard-info { background: #17a2b8; }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        notification.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
}