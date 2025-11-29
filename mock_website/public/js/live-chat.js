// Eula Elite Live Chat Widget
class EulaLiveChat {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.isOpen = false;
        this.clientId = this.generateClientId();
        this.clientName = localStorage.getItem('eula_client_name') || 'Client';
        this.typingTimer = null;
        this.isTyping = false;
        
        this.init();
    }
    
    generateClientId() {
        // Generate unique client ID or get from localStorage
        let clientId = localStorage.getItem('eula_client_id');
        if (!clientId) {
            clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('eula_client_id', clientId);
        }
        return clientId;
    }
    
    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.connectSocket();
    }
    
    createChatWidget() {
        // Create chat widget HTML structure
        const chatWidget = document.createElement('div');
        chatWidget.id = 'eula-chat-widget';
        chatWidget.innerHTML = `
            <div id="chat-toggle-btn" class="chat-toggle">
                <div class="chat-icon">💬</div>
                <div class="emergency-pulse"></div>
                <span class="chat-label">Secure PPO Chat</span>
                <div class="notification-dot" style="display: none;"></div>
            </div>
            
            <div id="chat-container" class="chat-container">
                <div class="chat-header">
                    <div class="chat-title">
                        <span class="security-shield">🛡️</span>
                        <div>
                            <h4>Secure PPO Chat</h4>
                            <div class="connection-status">
                                <span class="status-dot disconnected"></span>
                                <span class="status-text">Connecting...</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-controls">
                        <button id="emergency-btn" class="emergency-btn" title="Emergency Alert">🚨</button>
                        <button id="minimize-btn" class="minimize-btn" title="Minimize">−</button>
                    </div>
                </div>
                
                <div id="client-info" class="client-info">
                    <div class="info-row">
                        <label for="client-name-input">Name:</label>
                        <input type="text" id="client-name-input" value="${this.clientName}" placeholder="Enter your name">
                    </div>
                    <small>All communications are encrypted and monitored by licensed PPOs</small>
                </div>
                
                <div id="chat-messages" class="chat-messages">
                    <div class="system-message">
                        <div class="system-icon">🔒</div>
                        <div class="system-text">
                            Welcome to Eula Elite Secure Chat. Our Licensed Level IV Personal Protection Officers are standing by.
                            <br><strong>For immediate emergency assistance, call (713) 555-1234</strong>
                        </div>
                    </div>
                </div>
                
                <div class="typing-indicator" id="typing-indicator" style="display: none;">
                    <span class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span class="typing-text">PPO is typing...</span>
                </div>
                
                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <input type="text" id="chat-input" placeholder="Type your secure message..." disabled>
                        <button id="send-btn" class="send-btn" disabled>
                            <span class="send-icon">📤</span>
                        </button>
                    </div>
                    <div class="chat-footer">
                        <small>🔐 End-to-end encrypted | 24/7 PPO monitoring</small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
    }
    
    attachEventListeners() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const minimizeBtn = document.getElementById('minimize-btn');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const clientNameInput = document.getElementById('client-name-input');
        const emergencyBtn = document.getElementById('emergency-btn');
        
        toggleBtn.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.minimizeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        emergencyBtn.addEventListener('click', () => this.triggerEmergency());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            } else {
                this.handleTyping();
            }
        });
        
        clientNameInput.addEventListener('change', (e) => {
            this.clientName = e.target.value || 'Client';
            localStorage.setItem('eula_client_name', this.clientName);
            this.reconnectWithNewName();
        });
        
        // Handle outside clicks
        document.addEventListener('click', (e) => {
            if (!document.getElementById('eula-chat-widget').contains(e.target) && this.isOpen) {
                // Don't auto-minimize to keep chat accessible
            }
        });
    }
    
    connectSocket() {
        // Connect to Socket.IO server
        this.socket = io('http://localhost:8081');
        
        this.socket.on('connect', () => {
            console.log('🔗 Connected to Eula Elite Secure Chat');
            this.isConnected = true;
            this.updateConnectionStatus('connected', 'PPO Available');
            
            // Join chat room
            this.socket.emit('join_chat', {
                clientId: this.clientId,
                clientName: this.clientName,
                isAdmin: false
            });
            
            this.enableChatInput();
        });
        
        this.socket.on('disconnect', () => {
            console.log('🔌 Disconnected from Eula Elite Chat');
            this.isConnected = false;
            this.updateConnectionStatus('disconnected', 'Reconnecting...');
            this.disableChatInput();
        });
        
        this.socket.on('chat_history', (messages) => {
            this.loadChatHistory(messages);
        });
        
        this.socket.on('new_message', (messageData) => {
            this.displayMessage(messageData);
            
            // Show notification if chat is minimized
            if (!this.isOpen) {
                this.showNotification();
            }
        });
        
        this.socket.on('admin_joined', (data) => {
            this.displaySystemMessage(`🛡️ ${data.adminName} has joined your secure chat. PPO assistance is now active.`, 'admin-joined');\n            this.updateConnectionStatus('admin-active', `PPO Active: ${data.adminName}`);\n        });\n        \n        this.socket.on('admin_typing', () => {\n            this.showTypingIndicator('PPO is typing...');\n        });\n        \n        this.socket.on('admin_typing_stop', () => {\n            this.hideTypingIndicator();\n        });\n        \n        this.socket.on('connect_error', (error) => {\n            console.error('Chat connection error:', error);\n            this.updateConnectionStatus('error', 'Connection Error');\n        });\n    }\n    \n    reconnectWithNewName() {\n        if (this.socket && this.isConnected) {\n            this.socket.emit('join_chat', {\n                clientId: this.clientId,\n                clientName: this.clientName,\n                isAdmin: false\n            });\n        }\n    }\n    \n    toggleChat() {\n        const container = document.getElementById('chat-container');\n        const toggleBtn = document.getElementById('chat-toggle-btn');\n        \n        if (this.isOpen) {\n            container.style.display = 'none';\n            toggleBtn.classList.remove('chat-open');\n            this.isOpen = false;\n            this.hideNotification();\n        } else {\n            container.style.display = 'block';\n            toggleBtn.classList.add('chat-open');\n            this.isOpen = true;\n            this.hideNotification();\n            \n            // Focus input if connected\n            if (this.isConnected) {\n                document.getElementById('chat-input').focus();\n            }\n        }\n    }\n    \n    minimizeChat() {\n        this.toggleChat();\n    }\n    \n    updateConnectionStatus(status, text) {\n        const statusDot = document.querySelector('.status-dot');\n        const statusText = document.querySelector('.status-text');\n        \n        statusDot.className = `status-dot ${status}`;\n        statusText.textContent = text;\n    }\n    \n    enableChatInput() {\n        const chatInput = document.getElementById('chat-input');\n        const sendBtn = document.getElementById('send-btn');\n        \n        chatInput.disabled = false;\n        sendBtn.disabled = false;\n        chatInput.placeholder = 'Type your secure message...';\n    }\n    \n    disableChatInput() {\n        const chatInput = document.getElementById('chat-input');\n        const sendBtn = document.getElementById('send-btn');\n        \n        chatInput.disabled = true;\n        sendBtn.disabled = true;\n        chatInput.placeholder = 'Connecting to secure channel...';\n    }\n    \n    sendMessage() {\n        const chatInput = document.getElementById('chat-input');\n        const message = chatInput.value.trim();\n        \n        if (!message || !this.isConnected) return;\n        \n        // Send message via Socket.IO\n        this.socket.emit('send_message', {\n            message,\n            clientId: this.clientId\n        });\n        \n        chatInput.value = '';\n        this.stopTyping();\n    }\n    \n    displayMessage(messageData) {\n        const messagesContainer = document.getElementById('chat-messages');\n        const messageDiv = document.createElement('div');\n        \n        const isFromClient = messageData.senderType === 'client';\n        const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });\n        \n        messageDiv.className = `message ${isFromClient ? 'client-message' : 'admin-message'} ${messageData.isEmergency ? 'emergency-message' : ''}`;\n        \n        messageDiv.innerHTML = `\n            <div class=\"message-header\">\n                <span class=\"sender-name\">${isFromClient ? 'You' : messageData.sender}</span>\n                <span class=\"message-time\">${timestamp}</span>\n                ${messageData.isEmergency ? '<span class=\"emergency-flag\">🚨</span>' : ''}\n            </div>\n            <div class=\"message-content\">${this.escapeHtml(messageData.message)}</div>\n        `;\n        \n        messagesContainer.appendChild(messageDiv);\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n    }\n    \n    displaySystemMessage(message, type = 'info') {\n        const messagesContainer = document.getElementById('chat-messages');\n        const messageDiv = document.createElement('div');\n        \n        messageDiv.className = `system-message ${type}`;\n        messageDiv.innerHTML = `\n            <div class=\"system-icon\">${type === 'admin-joined' ? '🛡️' : '🔒'}</div>\n            <div class=\"system-text\">${message}</div>\n        `;\n        \n        messagesContainer.appendChild(messageDiv);\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n    }\n    \n    loadChatHistory(messages) {\n        const messagesContainer = document.getElementById('chat-messages');\n        \n        messages.forEach(message => {\n            this.displayMessage(message);\n        });\n    }\n    \n    handleTyping() {\n        if (!this.isTyping) {\n            this.isTyping = true;\n            this.socket.emit('typing_start', { clientId: this.clientId });\n        }\n        \n        // Clear existing timer\n        clearTimeout(this.typingTimer);\n        \n        // Set new timer\n        this.typingTimer = setTimeout(() => {\n            this.stopTyping();\n        }, 1000);\n    }\n    \n    stopTyping() {\n        if (this.isTyping) {\n            this.isTyping = false;\n            this.socket.emit('typing_stop', { clientId: this.clientId });\n        }\n    }\n    \n    showTypingIndicator(text = 'PPO is typing...') {\n        const indicator = document.getElementById('typing-indicator');\n        const typingText = indicator.querySelector('.typing-text');\n        \n        typingText.textContent = text;\n        indicator.style.display = 'flex';\n        \n        // Scroll to bottom\n        const messagesContainer = document.getElementById('chat-messages');\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n    }\n    \n    hideTypingIndicator() {\n        const indicator = document.getElementById('typing-indicator');\n        indicator.style.display = 'none';\n    }\n    \n    showNotification() {\n        const dot = document.querySelector('.notification-dot');\n        dot.style.display = 'block';\n    }\n    \n    hideNotification() {\n        const dot = document.querySelector('.notification-dot');\n        dot.style.display = 'none';\n    }\n    \n    triggerEmergency() {\n        if (!this.isConnected) {\n            alert('Emergency services unavailable. Please call (713) 555-1234 immediately.');\n            return;\n        }\n        \n        const confirmed = confirm(\n            '🚨 EMERGENCY ALERT 🚨\\n\\n' +\n            'This will immediately notify all available PPOs of an emergency situation.\\n\\n' +\n            'For immediate phone assistance, call (713) 555-1234\\n\\n' +\n            'Continue with emergency chat alert?'\n        );\n        \n        if (confirmed) {\n            // Get location if available\n            this.getLocationForEmergency((location) => {\n                const emergencyMessage = `🚨 EMERGENCY: Client requires immediate PPO assistance. Location: ${location || 'Unknown'}`;\n                \n                // Send emergency message\n                this.socket.emit('send_message', {\n                    message: emergencyMessage,\n                    clientId: this.clientId,\n                    isEmergency: true\n                });\n                \n                // Also send to emergency API\n                fetch('/api/chat/emergency', {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json'\n                    },\n                    body: JSON.stringify({\n                        clientId: this.clientId,\n                        message: emergencyMessage,\n                        location: location || 'Unknown'\n                    })\n                });\n                \n                this.displaySystemMessage('🚨 Emergency alert sent to all PPOs. Immediate response initiated.', 'emergency');\n            });\n        }\n    }\n    \n    getLocationForEmergency(callback) {\n        if ('geolocation' in navigator) {\n            navigator.geolocation.getCurrentPosition(\n                (position) => {\n                    const location = `${position.coords.latitude}, ${position.coords.longitude}`;\n                    callback(location);\n                },\n                () => {\n                    callback(null);\n                },\n                { timeout: 5000 }\n            );\n        } else {\n            callback(null);\n        }\n    }\n    \n    escapeHtml(text) {\n        const div = document.createElement('div');\n        div.textContent = text;\n        return div.innerHTML;\n    }\n}\n\n// Initialize chat when DOM is loaded\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.eulaChat = new EulaLiveChat();\n    });\n} else {\n    window.eulaChat = new EulaLiveChat();\n}