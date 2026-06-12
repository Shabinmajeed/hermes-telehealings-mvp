const termsModalTemplate = `
<style>
  .terms-modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(2px);
  }

  .terms-modal-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .terms-modal-content {
    background-color: #ffffff;
    height: 80%;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    padding: 24px;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
  }

  .terms-modal-overlay.open .terms-modal-content {
    transform: translateY(0);
  }

  .terms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .terms-title {
    font-size: 20px;
    font-weight: 800;
    color: #1a293b;
    margin: 0;
  }

  .terms-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
  }

  .terms-body {
    flex: 1;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    padding-right: 10px;
    margin-bottom: 20px;
  }
  
  .terms-body h3 {
    color: #1a293b;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .terms-actions {
    display: flex;
    gap: 12px;
  }

  .btn-reject, .btn-accept {
    flex: 1;
    height: 50px;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .btn-reject {
    background: #f1f5f9;
    color: #475569;
    border: none;
  }

  .btn-accept {
    background: #387bd5;
    color: #ffffff;
    border: none;
  }

  .btn-reject:active, .btn-accept:active {
    transform: scale(0.96);
  }
</style>

<div class="terms-modal-overlay" id="termsModal">
  <div class="terms-modal-content" onclick="event.stopPropagation()">
    <div class="terms-header">
      <h2 class="terms-title">Terms & Conditions</h2>
      <div class="terms-close" onclick="closeTermsModal()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    </div>
    <div class="terms-body">
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using the TeleHealings platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3>2. Privacy Policy</h3>
      <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, protect, and when we share personal information and other data with third parties.</p>
      
      <h3>3. User Conduct</h3>
      <p>You agree to use our services only for lawful purposes. You must not use our services to engage in any illegal activity or to violate any laws in your jurisdiction.</p>

      <h3>4. Medical Disclaimer</h3>
      <p>The content provided through TeleHealings is for informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>

      <h3>5. Modifications to Service</h3>
      <p>We reserve the right at any time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.</p>
      <br><br><br>
    </div>
    <div class="terms-actions">
      <button class="btn-reject" onclick="rejectTerms()">Reject</button>
      <button class="btn-accept" onclick="acceptTerms()">Accept</button>
    </div>
  </div>
</div>
`;

function initializeTermsModal() {
  if (document.getElementById('termsModal')) return;

  const appContainer = document.querySelector('.mobile-app-container') || document.body;
  appContainer.insertAdjacentHTML('beforeend', termsModalTemplate);

  const modal = document.getElementById('termsModal');
  modal.addEventListener('click', closeTermsModal); // Close on overlay click

  const checkbox = document.getElementById('consent-toggle');
  if (checkbox) {
    checkbox.addEventListener('click', (e) => {
      // If the user attempts to check the box, intercept and open the modal instead
      if (checkbox.checked) {
        e.preventDefault(); // Stop the check
        openTermsModal();
      }
    });
  }

  // Bind the opening of the modal to the "Terms" hyperlink
  const termsLink = document.querySelector('.consent-text a:first-of-type');
  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openTermsModal();
    });
  }
}

window.openTermsModal = function() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.add('open');
}

window.closeTermsModal = function() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.remove('open');
}

window.acceptTerms = function() {
  const checkbox = document.getElementById('consent-toggle');
  if (checkbox) checkbox.checked = true; // Check the box programmatically
  closeTermsModal();
}

window.rejectTerms = function() {
  const checkbox = document.getElementById('consent-toggle');
  if (checkbox) checkbox.checked = false; // Uncheck the box programmatically
  closeTermsModal();
}

// Initialize the modal into the DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTermsModal);
} else {
  initializeTermsModal();
}