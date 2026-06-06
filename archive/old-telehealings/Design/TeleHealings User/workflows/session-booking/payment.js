const paymentModalTemplate = `
<style>
  /* ==========================================================================
     [1] OVERLAY & MODAL CONTAINER
     ========================================================================== */
  .payment-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

  .payment-modal-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  /* ==========================================================================
     [2] BOTTOM SHEET CONTENT
     ========================================================================== */
  .payment-modal-content {
    background-color: #ffffff;
    height: auto;
    max-height: 95%;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    padding: 24px;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
    overflow-y: auto;
  }
  
  .payment-modal-content::-webkit-scrollbar {
    display: none;
  }

  .payment-modal-overlay.open .payment-modal-content {
    transform: translateY(0);
  }

  /* ==========================================================================
     [3] HEADER COMPONENT
     ========================================================================== */
  .payment-header {
    display: flex;
    align-items: center;
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
    cursor: pointer;
  }
  
  .payment-header svg {
    margin-right: 12px;
  }

  .payment-subtitle {
    font-size: 15px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 24px;
  }

  /* ==========================================================================
     [4] EXPRESS CHECKOUT BUTTONS
     ========================================================================== */
  .section-label-sm {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .express-btn {
    width: 100%;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 12px;
    transition: transform 0.2s ease;
    border: none;
  }

  .express-btn:active {
    transform: scale(0.98);
  }

  .btn-apple {
    background-color: #60a5fa; /* Soft blue from reference */
    color: #ffffff;
  }

  .btn-google {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #e2e8f0;
  }

  /* ==========================================================================
     [5] DIVIDER
     ========================================================================== */
  .divider-wrap {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
  }

  .divider-wrap::before,
  .divider-wrap::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }

  .divider-wrap span {
    padding: 0 12px;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
  }

  /* ==========================================================================
     [6] CARD FORM
     ========================================================================== */
  .card-form-box {
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .input-group {
    margin-bottom: 16px;
  }

  .input-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 8px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .custom-input {
    width: 100%;
    height: 48px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0 16px;
    font-size: 16px;
    color: #1a293b;
    outline: none;
    transition: border-color 0.2s;
  }

  .custom-input::placeholder {
    color: #cbd5e1;
  }

  .custom-input:focus {
    border-color: #3b82f6;
  }

  .input-icon {
    position: absolute;
    right: 16px;
    color: #94a3b8;
  }

  .form-row {
    display: flex;
    gap: 12px;
  }

  .form-row .input-group {
    flex: 1;
  }

  /* ==========================================================================
     [7] SAVE CARD CHECKBOX
     ========================================================================== */
  .save-card-wrap {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
    margin-top: 2px;
  }

  .custom-checkbox.checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  .checkbox-text {
    font-size: 11px;
    color: #64748b;
    line-height: 1.5;
  }

  /* ==========================================================================
     [8] PAY & BOOK BUTTON
     ========================================================================== */
  .pay-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: #ffffff;
    border: none;
    border-radius: 16px;
    padding: 18px;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }

  .pay-btn:active {
    transform: scale(0.98);
  }
</style>

<div class="payment-modal-overlay" id="paymentModal">
  <div class="payment-modal-content" onclick="event.stopPropagation()">
    
    <!-- Header -->
    <div class="payment-header" onclick="closePaymentModal()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back
    </div>
    <div class="payment-subtitle">Select a Payment Method</div>

    <!-- Express Checkout -->
    <div class="section-label-sm">Express Checkout</div>
    <button class="express-btn btn-apple">
      <img src="../../src/apple.png" alt="Apple" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);">
      Apple Pay
    </button>
    <button class="express-btn btn-google">
      <img src="../../src/google.png" alt="Google" style="width: 20px; height: 20px; object-fit: contain;"> Google Pay
    </button>

    <!-- Divider -->
    <div class="divider-wrap">
      <span>Or Pay With Card</span>
    </div>

    <!-- Card Form -->
    <div class="card-form-box">
      <div class="input-group">
        <label class="input-label">Cardholder Name</label>
        <input type="text" class="custom-input" placeholder="e.g. Dr. Jordan Smith">
      </div>
      <div class="input-group">
        <label class="input-label">Card Number</label>
        <div class="input-wrapper">
          <input type="text" class="custom-input" placeholder="0000 0000 0000 0000">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label class="input-label">Expiry Date</label>
          <input type="text" class="custom-input" placeholder="MM / YY">
        </div>
        <div class="input-group">
          <label class="input-label">CVV / CVC</label>
          <div class="input-wrapper">
            <input type="password" class="custom-input" placeholder="***">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkbox -->
    <div class="save-card-wrap">
      <div class="custom-checkbox" id="saveCardCheck">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="checkbox-text">
        Save this card for future consultations. Your data is encrypted and stored securely.
      </div>
    </div>

    <!-- Action Button -->
    <button class="pay-btn" onclick="confirmPayment()">
      Pay & Book
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>

  </div>
</div>
`;

function initializePaymentModal() {
  if (document.getElementById('paymentModal')) return;

  const appContainer = document.querySelector('.mobile-app-container') || document.body;
  appContainer.insertAdjacentHTML('beforeend', paymentModalTemplate);

  const modal = document.getElementById('paymentModal');
  
  // Checkbox toggle logic
  const checkbox = document.getElementById('saveCardCheck');
  if(checkbox) {
    checkbox.addEventListener('click', function() {
      this.classList.toggle('checked');
      const checkIcon = this.querySelector('svg');
      if (this.classList.contains('checked')) {
        checkIcon.style.display = 'block';
      } else {
        checkIcon.style.display = 'none';
      }
    });
  }

  // Close when clicking overlay
  modal.addEventListener('click', closePaymentModal);
}

// Initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePaymentModal);
} else {
  initializePaymentModal();
}

window.openPaymentModal = function() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.add('open');
};

window.closePaymentModal = function() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.remove('open');
};

window.confirmPayment = function() {
  // Route to the booking success/confirmation page
  window.location.href = 'booking-confirmed.html';
};