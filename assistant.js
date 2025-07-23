// Student Assistant Chatbot JavaScript

class StudentAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.apiSetup = document.getElementById('apiSetup');
        this.quickSuggestions = document.getElementById('quickSuggestions');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkApiKey();
        this.autoResizeTextarea();
    }
    
    setupEventListeners() {
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.toggleSendButton();
        });
        
        // Handle paste
        this.messageInput.addEventListener('paste', () => {
            setTimeout(() => {
                this.autoResizeTextarea();
                this.toggleSendButton();
            }, 10);
        });
    }
    
    checkApiKey() {
        if (!this.apiKey) {
            this.showApiSetup();
        } else {
            this.hideApiSetup();
        }
    }
    
    showApiSetup() {
        this.apiSetup.classList.remove('hidden');
        document.body.classList.add('show-api-setup');
    }
    
    hideApiSetup() {
        this.apiSetup.classList.add('hidden');
        document.body.classList.remove('show-api-setup');
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || !this.apiKey;
    }
    
    async sendMessage(messageText = null) {
        const message = messageText || this.messageInput.value.trim();
        if (!message || !this.apiKey) return;
        
        // Clear input and hide suggestions
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.toggleSendButton();
        this.hideQuickSuggestions();
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        const typingIndicator = this.showTypingIndicator();
        
        try {
            // Call Gemini API
            const response = await this.callGeminiAPI(message);
            
            // Remove typing indicator
            this.removeTypingIndicator(typingIndicator);
            
            // Add assistant response
            this.addMessage(response, 'assistant');
            
        } catch (error) {
            console.error('Error:', error);
            this.removeTypingIndicator(typingIndicator);
            this.addErrorMessage('Sorry, I encountered an error. Please try again or check your API key.');
        }
    }
    
    async callGeminiAPI(message) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: `You are a helpful student assistant for NITRA Technical Campus and AKTU students. 
                    
                    IMPORTANT: Format your response using markdown for better readability:
                    - Use **bold** for important terms and concepts
                    - Use *italics* for emphasis
                    - Use bullet points (- or *) for lists
                    - Use numbered lists (1. 2. 3.) for step-by-step instructions
                    - Use \`code\` for technical terms, formulas, or code snippets
                    - Use > for important quotes or tips
                    - Use ### for section headings when appropriate
                    - Use line breaks for better paragraph separation
                    
                    Provide helpful, accurate, and encouraging responses about academic topics, study tips, 
                    exam preparation, career guidance, and general student life. Keep responses concise but informative.
                    Structure your answers clearly with proper formatting.
                    
                    Student Question: ${message}`
                }]
            }]
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response generated');
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Create content container
        const messageContent = document.createElement('div');
        
        if (sender === 'assistant') {
            // Parse markdown for assistant messages
            messageContent.className = 'markdown-content';
            try {
                // Configure marked options for better parsing
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: false,
                    mangle: false
                });
                
                const rawHtml = marked.parse(text);
                // Sanitize the HTML to prevent XSS attacks
                const cleanHtml = DOMPurify.sanitize(rawHtml, {
                    ALLOWED_TAGS: [
                        'p', 'br', 'strong', 'em', 'u', 'b', 'i',
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'ul', 'ol', 'li',
                        'blockquote', 'code', 'pre',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td',
                        'a', 'hr'
                    ],
                    ALLOWED_ATTR: ['href', 'target', 'rel']
                });
                messageContent.innerHTML = cleanHtml;
                
                // Make external links open in new tab
                const links = messageContent.querySelectorAll('a[href^="http"]');
                links.forEach(link => {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                });
                
                // Add copy buttons to code blocks
                const codeBlocks = messageContent.querySelectorAll('pre code');
                codeBlocks.forEach(codeBlock => {
                    const pre = codeBlock.parentElement;
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-code-btn';
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.title = 'Copy code';
                    copyBtn.onclick = () => this.copyToClipboard(codeBlock.textContent, copyBtn);
                    
                    pre.style.position = 'relative';
                    pre.appendChild(copyBtn);
                });
                
            } catch (error) {
                console.error('Markdown parsing error:', error);
                // Fallback to plain text if markdown parsing fails
                messageContent.className = '';
                const fallbackP = document.createElement('p');
                fallbackP.textContent = text;
                messageContent.appendChild(fallbackP);
            }
        } else {
            // For user messages, use plain text
            const messageText = document.createElement('p');
            messageText.textContent = text;
            messageContent.appendChild(messageText);
        }
        
        const timestamp = document.createElement('span');
        timestamp.className = 'message-time';
        timestamp.textContent = this.getCurrentTime();
        
        content.appendChild(messageContent);
        content.appendChild(timestamp);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addErrorMessage(text) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = text;
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }
    
    removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    hideQuickSuggestions() {
        this.quickSuggestions.style.display = 'none';
    }
    
    showQuickSuggestions() {
        this.quickSuggestions.style.display = 'flex';
    }
    
    clearChat() {
        // Keep only the initial welcome message
        const messages = this.chatMessages.querySelectorAll('.message, .error-message');
        messages.forEach((message, index) => {
            if (index > 0) { // Keep the first message (welcome message)
                message.remove();
            }
        });
        this.showQuickSuggestions();
    }
    
    copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success feedback
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = '#4CAF50';
            
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#4CAF50';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                    button.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed: ', err);
            }
            document.body.removeChild(textArea);
        });
    }
}

// Global functions for HTML event handlers
function sendMessage() {
    if (window.assistant) {
        window.assistant.sendMessage();
    }
}

function sendQuickMessage(message) {
    if (window.assistant) {
        window.assistant.sendMessage(message);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        window.assistant.apiKey = apiKey;
        window.assistant.hideApiSetup();
        window.assistant.toggleSendButton();
        apiKeyInput.value = '';
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = 'API Key saved successfully!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    } else {
        alert('Please enter a valid API key');
    }
}

function clearChat() {
    if (window.assistant) {
        if (confirm('Are you sure you want to clear the chat history?')) {
            window.assistant.clearChat();
        }
    }
}

// Initialize the assistant when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.assistant = new StudentAssistant();
});

// Add CSS animation for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
