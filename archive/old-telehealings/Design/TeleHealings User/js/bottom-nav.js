const scriptTag = document.currentScript || document.querySelector('script[src*="bottom-nav.js"]');
const basePath = scriptTag ? scriptTag.getAttribute('src').replace('js/bottom-nav.js', '') : './';

const bottomNavTemplate = `
<style>
  /* Floating Bottom Navigation */
  .bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 16px 25px 16px;
    padding: 12px 0;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); /* Support for notched phones */
    z-index: 10;
    background: rgba(248, 251, 255, 0.85); /* Very light, airy brand-tinted glass */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 24px;
    border: 1px solid rgba(31, 48, 200, 0.6);
    box-shadow: 0 -8px 24px rgba(59, 130, 246, 0.05), 0 10px 30px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    /* Hardware acceleration for smooth scrolling under the glass blur */
    transform: translateZ(0);
    will-change: transform, backdrop-filter, height;
  }

  .bottom-nav.expanded {
    padding-top: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    gap: 16px;
    background: rgba(248, 251, 255, 0.95);
    box-shadow: 0 -12px 32px rgba(59, 130, 246, 0.08), 0 15px 40px rgba(0, 0, 0, 0.06);
  }

  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
  }

  .nav-top-row {
    height: 0;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    transform: translateY(10px);
  }

  .bottom-nav.expanded .nav-top-row {
    height: 44px;
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #8E9AA0; /* Soft slate grey */
    cursor: pointer;
    text-decoration: none;
    flex: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item.spacer {
    flex: 0 0 70px;
    pointer-events: none;
  }

  .nav-item.active, .bottom-nav.expanded .nav-item[data-nav="more"] {
    font-weight: 600;
    color: #387bd5; /* Corporate brand blue */
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-item.active .nav-icon {
    transform: translateY(-2px); /* Slight levitation when active */
  }

  .nav-label {
    font-size: 0.7rem;
    font-weight: inherit;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  /* Center Mascot Button (Absolute) */
  .nav-center-absolute {
    position: relative;
    position: absolute;
    left: 50%;
    top: 20px; /* Overhangs slightly in collapsed mode */
    transform: translate(-50%, -50%);
    z-index: 15;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .bottom-nav.expanded .nav-center-absolute {
    top: 50%; /* Exactly centered in the expanded nav */
  }

  .nav-center-btn {
    width: 56px;
    height: 56px;
    background: #FFFFFF;
    border-radius: 50%;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05), 0 8px 20px rgba(59, 130, 246, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(31, 48, 200, 0.6);
  }

  .nav-center-btn:active {
    transform: scale(0.92);
  }

  .nav-center-btn img {
    width: 32px;
    height: auto;
    object-fit: contain;
  }

  /* Invisible overlay to detect clicks outside the menu */
  .more-menu-overlay {
    position: absolute;
    inset: 0;
    z-index: 9;
    display: none;
    background: transparent;
  }

  .more-menu-overlay.open {
    display: block;
  }
</style>

<!-- Invisible overlay to detect clicks outside the menu -->
<div class="more-menu-overlay" id="moreMenuOverlay" onclick="closeMoreMenu()"></div>

<nav class="bottom-nav" id="bottomNav">
  
  <!-- TOP ROW (Expanded Menu Options) -->
  <div class="nav-row nav-top-row">
    <div class="nav-item" onclick="closeMoreMenu()">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
      <span class="nav-label">Support</span>
    </div>
    <div class="nav-item" onclick="window.location.href='${basePath}settings.html'">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      <span class="nav-label">Settings</span>
    </div>
    <div class="nav-item spacer"></div>
    <div class="nav-item" onclick="closeMoreMenu()">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span class="nav-label">History</span>
    </div>
    <div class="nav-item" data-nav="profile" onclick="window.location.href='${basePath}profile.html'">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span class="nav-label">Profile</span>
    </div>
  </div>

  <!-- BOTTOM ROW (Main Navigation) -->
  <div class="nav-row nav-bottom-row">
    <a href="${basePath}home.html" class="nav-item" data-nav="home">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5V20a2 2 0 0 0 2 2h4v-6h6v6h4a2 2 0 0 0 2-2v-9.5"></path><path d="M2 12l10-9 10 9"></path></svg>
      <span class="nav-label">Home</span>
    </a>
    <a href="${basePath}care.html" class="nav-item" data-nav="care">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5l-8.5-8.5a5.5 5.5 0 0 1 7.78-7.78L12 5.28l.72-1.06a5.5 5.5 0 0 1 7.78 7.78L12 20.5z"></path><path d="M12 8.5v5m-2.5-2.5h5"></path></svg>
      <span class="nav-label">Care</span>
    </a>
    <div class="nav-item spacer"></div>
    <a href="${basePath}discover.html" class="nav-item" data-nav="discover">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M3.6 9h16.8M3.6 15h16.8"></path><path d="M12 3c-2.5 3.5-4 7-4 9s1.5 5.5 4 9c2.5-3.5 4-7 4-9s-1.5-5.5-4-9z"></path></svg>
      <span class="nav-label">Discover</span>
    </a>
    <div class="nav-item" data-nav="more" onclick="toggleMoreMenu()">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"></path></svg>
      <span class="nav-label">More</span>
    </div>
  </div>

  <!-- Absolute Center Mascot Button -->
  <div class="nav-center-absolute">
    <button class="nav-center-btn" aria-label="Talk to Heali AI" onclick="openHealiChat()">
      <img src="${basePath}src/heali-icon.png" alt="Heali Mascot">
    </button>
  </div>

</nav>
`;

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("bottom-nav-placeholder");
  if (placeholder) {
    placeholder.innerHTML = bottomNavTemplate;

    // Dynamically highlight the active navigation item
    const currentPath = window.location.pathname.toLowerCase();
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
    let isActiveSet = false;

    navItems.forEach((item) => {
      const targetPage = item.getAttribute("data-nav");
      if (currentPath.includes(targetPage)) {
        item.classList.add("active");
        isActiveSet = true;
      }
    });

    // Fallback to "Home" if the path doesn't explicitly match (e.g. root localhost)
    if (!isActiveSet && navItems.length > 0) {
      navItems[0].classList.add("active");
    }
  }
});

// Expose Fan-out Menu Toggles Globally
window.toggleMoreMenu = function() {
  const bottomNav = document.getElementById('bottomNav');
  const overlay = document.getElementById('moreMenuOverlay');
  
  if (bottomNav && bottomNav.classList.contains('expanded')) {
    window.closeMoreMenu();
  } else {
    if (bottomNav) bottomNav.classList.add('expanded');
    if (overlay) overlay.classList.add('open');
  }
};

window.closeMoreMenu = function() {
  const bottomNav = document.getElementById('bottomNav');
  const overlay = document.getElementById('moreMenuOverlay');
  
  if (bottomNav) bottomNav.classList.remove('expanded');
  if (overlay) overlay.classList.remove('open');
  
  // Keep button active only if we are physically on a "more" URL path
  const moreBtn = document.querySelector('.nav-item[data-nav="more"]');
  if (moreBtn && !window.location.pathname.toLowerCase().includes('more')) {
    moreBtn.classList.remove('active');
  }
};