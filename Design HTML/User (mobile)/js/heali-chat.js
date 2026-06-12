(function() {
  // Prevent multiple executions from throwing a redeclaration error
  if (window.__healiChatLoaded) return;
  window.__healiChatLoaded = true;

const healiChatTemplate = `
<style>
  .heali-chat-overlay {
    position: absolute; /* Adjusted to lock inside the mobile container */
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    padding: 0 16px;
  }

  .heali-chat-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .heali-chat-container {
    background: #ffffff;
    width: 100%;
    height: 75vh;
    max-height: 700px;
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    transform: translateY(120%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    position: relative;
    margin-bottom: 95px; /* Floats above the bottom nav */
  }

  /* Chat Bubble Tail pointing to Mascot */
  .heali-chat-container::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 16px 16px 0;
    border-style: solid;
    border-color: #ffffff transparent transparent transparent;
  }

  .heali-chat-overlay.open .heali-chat-container {
    transform: translateY(0);
  }

  /* Header */
  .heali-chat-header {
    display: flex;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .heali-chat-avatar {
    width: 44px;
    height: 44px;
    background: #f0f8ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    border: 1.5px solid #cbe0f9;
    color: #387bd5;
  }

  .heali-chat-title-block {
    flex: 1;
  }

  .heali-chat-title {
    font-size: 18px;
    font-weight: 800;
    color: #1a293b;
    margin: 0;
  }

  .heali-chat-status {
    font-size: 12px;
    color: #10b981;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .heali-chat-status::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
  }

  .heali-chat-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: background 0.2s ease;
  }

  .heali-chat-close:active {
    background: #e2e8f0;
  }

  /* Chat Message Area */
  .heali-chat-messages {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #fbfcfd;
  }

  .heali-chat-messages::-webkit-scrollbar {
    display: none;
  }

  .chat-bubble-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 85%;
    animation: slideFadeUp 0.3s ease-out forwards;
  }

  .chat-bubble-wrapper.ai {
    align-self: flex-start;
  }

  .chat-bubble-wrapper.user {
    align-self: flex-end;
    align-items: flex-end;
  }

  .chat-bubble {
    padding: 14px 18px;
    border-radius: 20px;
    font-size: 15px;
    line-height: 1.5;
    position: relative;
    word-wrap: break-word;
  }

  .chat-bubble-wrapper.ai .chat-bubble {
    background: #ffffff;
    color: #334155;
    border: 1px solid #e2e8f0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .chat-bubble-wrapper.user .chat-bubble {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  .chat-time {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 6px;
    padding: 0 4px;
    font-weight: 500;
  }

  /* Input Area */
  .heali-chat-input-area {
    padding: 16px 24px;
    background: #ffffff;
    border-top: 1px solid #f1f5f9;
    display: flex;
    gap: 12px;
    align-items: flex-end;
    border-radius: 0 0 28px 28px;
  }

  .heali-chat-input {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    padding: 14px 18px;
    font-size: 16px;
    outline: none;
    resize: none;
    max-height: 120px;
    min-height: 50px;
    font-family: inherit;
    color: #1a293b;
    transition: border-color 0.2s;
  }

  .heali-chat-input:focus {
    border-color: #387bd5;
    background: #ffffff;
  }

  .heali-chat-input::placeholder {
    color: #94a3b8;
  }

  .heali-chat-send {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #387bd5;
    color: #ffffff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 12px rgba(56, 123, 213, 0.25);
  }

  .heali-chat-send:active {
    transform: scale(0.95);
  }

  /* AI Typing Indicator */
  .typing-indicator {
    display: flex;
    gap: 5px;
    padding: 8px 4px;
  }
  .typing-dot {
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typingBounce 1.4s infinite ease-in-out both;
  }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typingBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
    40% { transform: scale(1); opacity: 1; }
  }
</style>

<div class="heali-chat-overlay" id="healiChatModal">
  <div class="heali-chat-container" onclick="event.stopPropagation()">
    
    <!-- Header -->
    <div class="heali-chat-header">
      <div class="heali-chat-avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2z"></path>
          <path d="M16 8h-8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"></path>
          <path d="M9 16v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4"></path>
        </svg>
      </div>
      <div class="heali-chat-title-block">
        <h3 class="heali-chat-title">Heali AI</h3>
        <div class="heali-chat-status">Online</div>
      </div>
      <div class="heali-chat-close" onclick="closeHealiChat()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    </div>

    <!-- Messages -->
    <div class="heali-chat-messages" id="healiChatMessages">
      <div class="chat-bubble-wrapper ai">
        <div class="chat-bubble">Hi there! I'm Heali. How can I support your wellness journey today?</div>
        <div class="chat-time">Just now</div>
      </div>
    </div>

    <!-- Input -->
    <div class="heali-chat-input-area">
      <textarea class="heali-chat-input" id="healiChatInput" placeholder="Message Heali..." rows="1"></textarea>
      <button class="heali-chat-send" onclick="sendHealiMessage()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>

  </div>
</div>
`;

window.initializeHealiChat = function() {
  if (document.getElementById('healiChatModal')) return;
  
  const appContainer = document.querySelector('.mobile-app-container') || document.body;
  appContainer.insertAdjacentHTML('beforeend', healiChatTemplate);

  const modal = document.getElementById('healiChatModal');
  const input = document.getElementById('healiChatInput');

  // Close when clicking the dark background overlay
  modal.addEventListener('click', closeHealiChat);

  // Auto-resize textarea logic
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // Reset back to original height if emptied
    if(this.value === '') this.style.height = '50px'; 
  });

  // Enter key to send (Shift+Enter for new line)
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendHealiMessage();
    }
  });
};

// Initialize immediately if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initializeHealiChat);
} else {
  window.initializeHealiChat();
}

/* Global Functions */
window.openHealiChat = function() {
  let modal = document.getElementById('healiChatModal');
  if (!modal) {
    window.initializeHealiChat();
    modal = document.getElementById('healiChatModal');
  }
  if (modal) {
    // Small timeout ensures CSS transitions trigger correctly if just injected
    setTimeout(() => modal.classList.add('open'), 10);
  }
};

window.closeHealiChat = function() {
  const modal = document.getElementById('healiChatModal');
  if (modal) modal.classList.remove('open');
};

window.sendHealiMessage = function() {
  const input = document.getElementById('healiChatInput');
  const messageContainer = document.getElementById('healiChatMessages');
  const text = input.value.trim();

  if (!text) return;

  // 1. Add User Message
  const userHtml = `
    <div class="chat-bubble-wrapper user">
      <div class="chat-bubble">${escapeHtml(text)}</div>
      <div class="chat-time">Just now</div>
    </div>
  `;
  messageContainer.insertAdjacentHTML('beforeend', userHtml);
  
  // Clear and reset input
  input.value = '';
  input.style.height = '50px';
  scrollToBottom();

  // 2. Add AI Typing Indicator
  const typingId = 'typing-' + Date.now();
  const typingHtml = `
    <div class="chat-bubble-wrapper ai" id="${typingId}">
      <div class="chat-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  messageContainer.insertAdjacentHTML('beforeend', typingHtml);
  scrollToBottom();

  // 3. Simulate AI Response Delay
  setTimeout(() => {
    const typingIndicator = document.getElementById(typingId);
    if (typingIndicator) typingIndicator.remove();

    const aiResponse = generateHealiResponse(text);
    const aiHtml = `
      <div class="chat-bubble-wrapper ai">
        <div class="chat-bubble">${aiResponse}</div>
        <div class="chat-time">Just now</div>
      </div>
    `;
    messageContainer.insertAdjacentHTML('beforeend', aiHtml);
    scrollToBottom();
  }, 1500 + Math.random() * 1000); // Random delay between 1.5s - 2.5s for realism
};

// Natural Language Heuristics for the AI Demo
function generateHealiResponse(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('book') || lowerText.includes('appointment') || lowerText.includes('schedule')) {
    return "I can help with that! You can browse our licensed therapists and select a time that works for you by heading over to the <strong>Care</strong> tab.";
  }
  if (lowerText.includes('sad') || lowerText.includes('stress') || lowerText.includes('anx') || lowerText.includes('overwhelm')) {
    return "I hear you, and I want you to know it's completely normal to feel this way. Would you like to try a quick 3-minute guided breathing exercise to help center yourself?";
  }
  if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
    return "Hello! How are you feeling today?";
  }
  if (lowerText.includes('thank')) {
    return "You're very welcome! I'm always here if you need to talk.";
  }
  
  return "Thank you for sharing that with me. I'm here to support you. Is there anything specific you'd like to explore or discuss today?";
}

function scrollToBottom() {
  const messageContainer = document.getElementById('healiChatMessages');
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

})();