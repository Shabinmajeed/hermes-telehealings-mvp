const bookingModalTemplate = `
<style>
  /* ==========================================================================
     [1] OVERLAY & MODAL CONTAINER
     Handles the darkened background blur, z-index stacking, and the initial 
     hidden state of the bottom sheet overlay.
     ========================================================================== */
  .booking-modal-overlay {
    position: absolute; /* absolute relative to mobile-app-container */
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

  .booking-modal-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  /* ==========================================================================
     [2] BOTTOM SHEET CONTENT
     The main panel that slides up from the bottom. Contains all booking options.
     ========================================================================== */
  .booking-modal-content {
    background-color: #8291a4; /* Grayish blue matching the design */
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
  }

  .booking-modal-overlay.open .booking-modal-content {
    transform: translateY(0);
  }

  /* ==========================================================================
     [3] HEADER COMPONENT
     The top navigation area inside the sheet (e.g., the 'Back' button).
     ========================================================================== */
  .booking-header {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 24px;
    cursor: pointer;
  }
  
  .booking-header svg {
    margin-right: 12px;
  }

  /* ==========================================================================
     [4] SESSION DETAILS CARD
     The informational white card displaying the session type, duration & price.
     ========================================================================== */
  .booking-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .booking-card-title {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .booking-card-main {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
  }

  .booking-card-sub {
    font-size: 14px;
    color: #475569;
  }

  /* ==========================================================================
     [5] TYPOGRAPHY & SECTION HEADERS
     Reusable sub-headers used above the date, time, and preference selectors.
     ========================================================================== */
  .booking-section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 16px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.4);
    padding-bottom: 5px;
  }

  /* ==========================================================================
     [6] HORIZONTAL DATE SCROLLER
     Styles for the swipeable row of pill-shaped date selection boxes.
     ========================================================================== */
  .date-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 5px; /* Added more space to accommodate visibility */
    margin-bottom: 10px;
    scrollbar-width: none;
  }
  
  .date-scroll::-webkit-scrollbar {
    display: none;
  }

  .date-box {
    background: #ffffff;
    min-width: 65px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    flex-shrink: 0; /* Ensures boxes never squish horizontally */
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .date-box.active {
    background: #3b82f6;
  }

  .date-box.active .date-day,
  .date-box.active .date-num {
    color: #ffffff;
  }

  .date-day {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .date-num {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }

  /* ==========================================================================
     [7] INTERACTIVE OPTIONS GRID
     3-column grid layout for time slots and session preferences (video/audio).
     ========================================================================== */
  .options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 5px;
  }

  .option-btn {
    background: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 14px 8px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .option-btn.active {
    background: #3b82f6;
    color: #ffffff;
  }

  .option-btn svg {
    stroke: #64748b;
  }

  .option-btn.active svg {
    stroke: #ffffff;
  }

  /* ==========================================================================
     [8] CONFIRM APPOINTMENT BUTTON
     The primary call-to-action button positioned at the bottom of the sheet.
     ========================================================================== */
  .confirm-btn {
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
    margin-top: 32px; /* Replaces auto to ensure it doesn't hide at the bottom */
    width: 100%;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }

  .confirm-btn:active {
    transform: scale(0.98);
  }
</style>

<!-- ========================================================================== -->
<!-- [MODAL DOM STRUCTURE]                                                      -->
<!-- The complete HTML hierarchy for the booking pop-up injected dynamically.   -->
<!-- ========================================================================== -->
<div class="booking-modal-overlay" id="bookingModal">
  <div class="booking-modal-content" onclick="event.stopPropagation()"> <!-- Prevent overlay click from triggering inside the panel -->
    
    <!-- [Header Section] ----------------------------------------------------- -->
    <div class="booking-header" onclick="closeBookingModal()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back
    </div>

    <!-- [Session Details] ---------------------------------------------------- -->
    <div class="booking-card">
      <div class="booking-card-title">Session Details</div>
      <div class="booking-card-main">Single Session</div>
      <div class="booking-card-sub">50 minutes • ₹ 1500</div>
    </div>

    <!-- [Date Selector Row] -------------------------------------------------- -->
    <div class="booking-section-title">
      <span>Select Date</span>
      <span style="font-weight: 500; opacity: 0.9;">April 2026</span>
    </div>
    <div class="date-scroll" id="bookingDates">
      <div class="date-box"><div class="date-day">Mon</div><div class="date-num">16</div></div>
      <div class="date-box active"><div class="date-day">Tue</div><div class="date-num">17</div></div>
      <div class="date-box"><div class="date-day">Wed</div><div class="date-num">18</div></div>
      <div class="date-box"><div class="date-day">Thu</div><div class="date-num">19</div></div>
      <div class="date-box"><div class="date-day">Fri</div><div class="date-num">20</div></div>
    </div>

    <!-- [Time Slot Grid] ----------------------------------------------------- -->
    <div class="booking-section-title">
      <span style="display:flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        Time Slot
      </span>
    </div>
    <div class="options-grid" id="bookingTimes">
      <button class="option-btn active">01:00 PM</button>
      <button class="option-btn">02:30 PM</button>
      <button class="option-btn">04:00 PM</button>
      <button class="option-btn">06:00 PM</button>
      <button class="option-btn">07:30 PM</button>
    </div>

    <!-- [Session Preferences (Video/Audio/Chat)] ----------------------------- -->
    <div class="booking-section-title">
      <span>Session Preference</span>
    </div>
    <div class="options-grid" id="bookingPrefs">
      <button class="option-btn active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        Video
      </button>
      <button class="option-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        Audio
      </button>
      <button class="option-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        Chat
      </button>
    </div>

    <!-- [Submit Action] ------------------------------------------------------ -->
    <button class="confirm-btn" onclick="confirmAppointment()">
      Confirm Appointment
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>

  </div>
</div>
`;

/* ==========================================================================
   [9] JAVASCRIPT LOGIC & LIFECYCLE
   Handles DOM injection, event delegation, and modal state management.
   ========================================================================== */
function initializeBookingModal() {
  // Safely abort if the modal is already present to prevent duplicate DOM nodes
  if (document.getElementById('bookingModal')) return;

  // 1. Inject the modal template into the app container (or body as fallback)
  const appContainer = document.querySelector('.mobile-app-container') || document.body;
  appContainer.insertAdjacentHTML('beforeend', bookingModalTemplate);

  const modal = document.getElementById('bookingModal');

  // 2. Helper function to setup mutual-exclusion (single selection) on button groups
  function setupSingleSelection(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('click', (e) => {
        // Remove 'active' class from all siblings
        elements.forEach(item => item.classList.remove('active'));
        // Add 'active' class to the clicked element
        e.currentTarget.classList.add('active');
      });
    });
  }

  // Apply the selection logic to the dates, times, and preferences grids
  setupSingleSelection('#bookingDates .date-box');
  setupSingleSelection('#bookingTimes .option-btn');
  setupSingleSelection('#bookingPrefs .option-btn');

  // 3. Automatically close modal when clicking the dark background overlay
  modal.addEventListener('click', closeBookingModal);

  // 4. Bind the modal opening mechanism to all elements carrying the '.book-btn' class
  const openButtons = document.querySelectorAll('.book-btn');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submissions or anchor jumps
      modal.classList.add('open');
    });
  });
}

// Trigger Initialization based on DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBookingModal);
} else {
  initializeBookingModal();
}

/* ==========================================================================
   [GLOBAL ACTION HANDLERS]
   Functions exposed to the window object to be called directly from HTML inline events.
   ========================================================================== */
window.closeBookingModal = function() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('open');
};

window.confirmAppointment = function() {
  // Route to the booking summary page
  window.location.href = './workflows/session-booking/session-confirm.html';
};