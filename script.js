/* ============================================================
   CKH Student Portal - Combined Script
   Login Page Logic + Dashboard Logic
   ============================================================ */

/* =========================================================== */
/* == LOGIN PAGE LOGIC                                       == */
/* =========================================================== */

const VALID_STUDENT_ID = "CKH2024001";
let currentCaptcha = "";

const CAPTCHA_COLORS = [
  "#E67E22",
  "#D95388",
  "#2F3A44",
  "#16A085",
  "#8E44AD",
  "#2980B9",
  "#D35400"
];

const STRIKE_LINE_COLORS = [
  "#E67E22",
  "#27AE60",
  "#2980B9",
  "#8E44AD",
  "#D95388",
  "#708090"
];

function generateRandomCaptchaText() {
  const chars = "23456789abcdefghkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function drawCaptcha(text) {
  const canvas = document.getElementById("captcha-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#FAF9F6";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 35; i++) {
    ctx.fillStyle = CAPTCHA_COLORS[Math.floor(Math.random() * CAPTCHA_COLORS.length)];
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = STRIKE_LINE_COLORS[i % STRIKE_LINE_COLORS.length];
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = Math.random() * 1.2 + 0.8;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width * 0.3, Math.random() * height);
    ctx.lineTo(width * 0.7 + Math.random() * width * 0.3, Math.random() * height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  const charSpacing = width / (text.length + 1);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const color = CAPTCHA_COLORS[i % CAPTCHA_COLORS.length];
    ctx.save();
    const angle = (Math.random() - 0.5) * 0.44;
    const x = (i + 1) * charSpacing;
    const y = height / 2 + (Math.random() - 0.5) * 6 + 2;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = "bold " + (Math.floor(Math.random() * 4) + 21) + "px 'Inter', sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  for (let i = 0; i < 2; i++) {
    ctx.strokeStyle = STRIKE_LINE_COLORS[(i + 2) % STRIKE_LINE_COLORS.length];
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 20, Math.random() * height);
    ctx.lineTo(width - Math.random() * 20, Math.random() * height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}

function regenerateCaptcha() {
  currentCaptcha = generateRandomCaptchaText();
  drawCaptcha(currentCaptcha);
  const refreshIcon = document.getElementById("refresh-icon");
  if (refreshIcon) {
    refreshIcon.style.transform = "rotate(360deg)";
    setTimeout(() => { refreshIcon.style.transform = "rotate(0deg)"; }, 300);
  }
  onInputChange();
}

function onInputChange() {
  const idInput = document.getElementById("student-id-input");
  const captchaInput = document.getElementById("captcha-input");
  const idContainer = document.getElementById("student-id-container");
  const captchaContainer = document.getElementById("captcha-container");
  const validIcon = document.getElementById("id-valid-icon");
  const idHelperLabel = document.getElementById("id-helper-label");
  const loginBtn = document.getElementById("login-btn");

  if (!idInput) return;

  const enteredId = (idInput.value || "").trim().toUpperCase();
  const enteredCaptcha = (captchaInput.value || "").trim();

  const isIdCorrect = enteredId === VALID_STUDENT_ID;
  const isCaptchaCorrect = enteredCaptcha.length > 0 && enteredCaptcha === currentCaptcha; // case-sensitive

  if (isIdCorrect) {
    if (validIcon) validIcon.classList.remove("hidden");
    if (idHelperLabel) { idHelperLabel.innerText = "Verified Student ID \u2713"; idHelperLabel.className = "text-emerald-700 font-semibold"; }
    if (idContainer) { idContainer.classList.add("valid"); idContainer.classList.remove("error"); }
  } else {
    if (validIcon) validIcon.classList.add("hidden");
    if (idContainer) idContainer.classList.remove("valid");
    if (idHelperLabel) {
      idHelperLabel.innerText = enteredId.length >= 3 ? 'Student ID not found' : 'Enter ID to verify';
      idHelperLabel.className = 'text-brandMuted font-medium';
    }
  }

  if (isCaptchaCorrect) {
    if (captchaContainer) { captchaContainer.classList.add("valid"); captchaContainer.classList.remove("error"); }
  } else {
    if (captchaContainer) captchaContainer.classList.remove("valid");
  }

  if (loginBtn) {
    if (isIdCorrect && isCaptchaCorrect) {
      loginBtn.removeAttribute("disabled");
      loginBtn.classList.remove("opacity-40", "cursor-not-allowed");
      loginBtn.classList.add("hover:shadow-md", "active:scale-[0.99]", "cursor-pointer");
    } else {
      loginBtn.setAttribute("disabled", "true");
      loginBtn.classList.add("opacity-40", "cursor-not-allowed");
      loginBtn.classList.remove("hover:shadow-md", "active:scale-[0.99]", "cursor-pointer");
    }
  }
}

function fillDemoID() {
  const idInput = document.getElementById("student-id-input");
  if (idInput) { idInput.value = VALID_STUDENT_ID; onInputChange(); }
  const captchaInput = document.getElementById("captcha-input");
  if (captchaInput) captchaInput.focus();
}

function autoFillCurrentCaptcha() {
  const captchaInput = document.getElementById("captcha-input");
  if (captchaInput) { captchaInput.value = currentCaptcha; onInputChange(); }
}

function quickLogin() {
  const idInput = document.getElementById("student-id-input");
  const captchaInput = document.getElementById("captcha-input");
  if (idInput) idInput.value = VALID_STUDENT_ID;
  if (captchaInput) captchaInput.value = currentCaptcha;
  onInputChange();
}

function handleLoginSubmit(event) {
  if (event) event.preventDefault();

  const idInput = document.getElementById("student-id-input");
  const captchaInput = document.getElementById("captcha-input");
  const enteredId = (idInput.value || "").trim().toUpperCase();
  const enteredCaptcha = (captchaInput.value || "").trim();

  if (enteredId === VALID_STUDENT_ID && enteredCaptcha === currentCaptcha) { // case-sensitive
    const loginBtn = document.getElementById("login-btn");
    const btnText = document.getElementById("login-btn-text");
    const btnArrow = document.getElementById("login-btn-arrow");
    const spinner = document.getElementById("login-spinner");
    const successBanner = document.getElementById("auth-success-banner");

    if (btnText) btnText.innerText = "Authenticating...";
    if (btnArrow) btnArrow.classList.add("hidden");
    if (spinner) spinner.classList.remove("hidden");
    if (loginBtn) loginBtn.classList.add("pointer-events-none");

    setTimeout(() => {
      if (spinner) spinner.classList.add("hidden");
      if (btnText) btnText.innerText = "Access Granted \u2713";
      if (successBanner) successBanner.classList.remove("hidden");

      /* Transition to the dashboard view after a short delay */
      setTimeout(() => {
        showView('dashboard');
      }, 800);
    }, 600);
  }
}

/* =========================================================== */
/* == DASHBOARD LOGIC                                        == */
/* =========================================================== */

const screenTitles = {
  'dashboard': {
    title: 'Good Morning, Eshanu!',
    subtitle: "Here's your academic overview for a better tomorrow."
  },
  'profile': {
    title: 'Student Profile',
    subtitle: 'Manage your personal details, academic history and contacts.'
  },
  'fee-status': {
    title: 'Fee Status',
    subtitle: 'Live fee verification, dues tracker, and billing ledger.'
  },
  'make-payment': {
    title: 'Make Fee Payment',
    subtitle: 'Fast, encrypted payment for tuition and laboratory courses.'
  },
  'payment-successful': {
    title: 'Payment Confirmation',
    subtitle: 'Your transaction has succeeded. A formal receipt is available.'
  },
  'download-receipt': {
    title: 'Fee Payment Receipt',
    subtitle: 'Authentic tax and tuition invoice from CKH Institute.'
  },
  'payment-history': {
    title: 'Payment History & Ledger',
    subtitle: 'Comprehensive ledger of past transactions and payment receipts.'
  }
};

/* showView switches between the login page and the dashboard */
function showView(view) {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  if (view === 'login') {
    // ── Logout confirmation ────────────────────────────────────
    const confirmed = window.confirm(
      'Are you sure you want to logout?\nYou will be returned to the login screen.'
    );
    if (!confirmed) return;

    // ── Reset login form to factory defaults ──────────────────
    const idInput        = document.getElementById('student-id-input');
    const captchaInput   = document.getElementById('captcha-input');
    const idContainer    = document.getElementById('student-id-container');
    const captchaContainer = document.getElementById('captcha-container');
    const validIcon      = document.getElementById('id-valid-icon');
    const idHelperLabel  = document.getElementById('id-helper-label');
    const loginBtn       = document.getElementById('login-btn');
    const btnText        = document.getElementById('login-btn-text');
    const btnArrow       = document.getElementById('login-btn-arrow');
    const spinner        = document.getElementById('login-spinner');
    const successBanner  = document.getElementById('auth-success-banner');

    // Clear input fields
    if (idInput)      idInput.value = '';
    if (captchaInput) captchaInput.value = '';

    // Reset Student ID field state
    if (validIcon)     validIcon.classList.add('hidden');
    if (idContainer)   { idContainer.classList.remove('valid', 'error'); }
    if (idHelperLabel) { idHelperLabel.innerText = 'Enter ID to verify'; idHelperLabel.className = 'text-brandMuted font-medium'; }

    // Reset captcha field state
    if (captchaContainer) { captchaContainer.classList.remove('valid', 'error'); }

    // Reset login button
    if (loginBtn) {
      loginBtn.setAttribute('disabled', 'true');
      loginBtn.classList.add('opacity-40', 'cursor-not-allowed');
      loginBtn.classList.remove('hover:shadow-md', 'active:scale-[0.99]', 'cursor-pointer', 'pointer-events-none');
    }
    if (btnText)  btnText.innerText = 'Login';
    if (btnArrow) btnArrow.classList.remove('hidden');
    if (spinner)  spinner.classList.add('hidden');

    // Hide success banner
    if (successBanner) successBanner.classList.add('hidden');

    // Generate a fresh captcha
    regenerateCaptcha();

    // Switch views
    dashboardView.classList.add('hidden');
    loginView.classList.remove('hidden');

  } else {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    navigateTo('dashboard');
  }
}

function toggleMobileDrawer(open) {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (!drawer || !backdrop) return;
  if (open) {
    drawer.classList.remove('-translate-x-full');
    drawer.classList.add('translate-x-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
  } else {
    drawer.classList.add('-translate-x-full');
    drawer.classList.remove('translate-x-0');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
  }
}

function navigateTo(screenId) {
  const screens = document.querySelectorAll('.screen-view');
  screens.forEach(s => s.classList.add('hidden'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.remove('hidden');
  const scrollArea = document.getElementById('main-content-scroll');
  if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
  const titleEl = document.getElementById('header-title');
  const subtitleEl = document.getElementById('header-subtitle');
  if (screenTitles[screenId]) {
    if (titleEl) titleEl.innerText = screenTitles[screenId].title;
    if (subtitleEl) subtitleEl.innerText = screenTitles[screenId].subtitle;
  }
  const navItems = document.querySelectorAll('#sidebar-nav .nav-item, #mobile-sidebar-nav .nav-item');
  navItems.forEach(item => {
    const itemNav = item.getAttribute('data-nav');
    if (itemNav === screenId) {
      item.className = "nav-item w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#D9D3C7]/40 text-brandDark border border-[#D9D3C7] shadow-sm transition-all duration-200 min-h-[44px]";
      const svg = item.querySelector('svg');
      if (svg) { svg.classList.remove('text-brandMuted'); svg.classList.add('text-brandDark'); }
      const span = item.querySelector('span');
      if (span) span.className = "tracking-wide text-left font-semibold";
    } else {
      item.className = "nav-item w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-brandMuted hover:text-brandDark hover:bg-stoneAccent/20 transition duration-150 min-h-[44px]";
      const svg = item.querySelector('svg');
      if (svg) { svg.classList.add('text-brandMuted'); svg.classList.remove('text-brandDark'); }
      const span = item.querySelector('span');
      if (span) span.className = "tracking-wide text-left font-normal";
    }
  });
}

function simulatePaymentSuccess() {
  const activeMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'upi';
  const modeEl = document.getElementById('success-payment-mode');
  if (modeEl) {
    if (activeMethod === 'upi') {
      const vpaVal = document.getElementById('vpa-input')?.value || 'UPI';
      modeEl.innerText = 'UPI (' + vpaVal + ')';
    } else if (activeMethod === 'card') {
      const cardNum = document.getElementById('card-number-input')?.value || 'Card';
      const last4 = cardNum.slice(-4);
      modeEl.innerText = 'Credit/Debit Card (Ending \u2022\u2022 ' + (last4 || '8821') + ')';
    } else if (activeMethod === 'netbanking') {
      const selBank = document.querySelector('input[name="selected_bank"]:checked')?.value || 'sbi';
      modeEl.innerText = 'Net Banking (' + selBank.toUpperCase() + ')';
    }
  }
  navigateTo('payment-successful');
}

function selectUpiApp(app) {
  const vpaInput = document.getElementById('vpa-input');
  if (!vpaInput) return;
  if (app === 'gpay') vpaInput.value = 'eshanu.mondal@okhdfcbank';
  else if (app === 'phonepe') vpaInput.value = '9876543210@ybl';
  else if (app === 'paytm') vpaInput.value = '9876543210@paytm';
  else if (app === 'bhim') vpaInput.value = 'eshanu@upi';
  verifyUpiId();
}

function verifyUpiId() {
  const badge = document.getElementById('vpa-verified-badge');
  const btn = document.getElementById('verify-upi-btn');
  if (badge && btn) {
    btn.innerText = 'Verified';
    btn.classList.add('bg-emerald-700');
    badge.classList.remove('hidden');
  }
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  value = value.substring(0, 16);
  const parts = [];
  for (let i = 0; i < value.length; i += 4) { parts.push(value.substring(i, i + 4)); }
  input.value = parts.join(' ');
}

function formatExpiry(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) { value = value.substring(0, 2) + '/' + value.substring(2, 4); }
  input.value = value.substring(0, 5);
}

function switchPaymentMethod(val) {
  updatePaymentView(val);
}

function selectBank(el) {
  document.querySelectorAll('.bank-pill-card').forEach(c => {
    c.classList.remove('border-brandDark', 'bg-stoneAccent/20');
    c.classList.add('border-stoneAccent', 'bg-white');
  });
  el.classList.remove('border-stoneAccent', 'bg-white');
  el.classList.add('border-brandDark', 'bg-stoneAccent/20');
}

function closeLedgerModal() {
  const modal = document.getElementById('ledger-detail-modal');
  if (modal) modal.classList.add('hidden');
}

/* =========================================================== */
/* == DOM READY INITIALIZATION                               == */
/* =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* Initialize captcha on the login screen */
  regenerateCaptcha();

  /* Payment method radio buttons & sub-panels */
  const radioInputs = document.querySelectorAll('input[name="payment_method"]');
  const step2Heading = document.getElementById('step2-heading');
  const subpanelUpi = document.getElementById('subpanel-upi');
  const subpanelCard = document.getElementById('subpanel-card');
  const subpanelNetbanking = document.getElementById('subpanel-netbanking');

  function updatePaymentView(selectedVal) {
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.classList.remove('border-brandDark', 'bg-stoneAccent/20');
      card.classList.add('border-stoneAccent', 'bg-white');
    });
    const checkedRadio = document.querySelector(`input[name="payment_method"][value="${selectedVal}"]`);
    if (checkedRadio) {
      checkedRadio.checked = true;
      const parentCard = checkedRadio.closest('.payment-method-card');
      if (parentCard) {
        parentCard.classList.remove('border-stoneAccent', 'bg-white');
        parentCard.classList.add('border-brandDark', 'bg-stoneAccent/20');
      }
    }
    subpanelUpi?.classList.add('hidden');
    subpanelCard?.classList.add('hidden');
    subpanelNetbanking?.classList.add('hidden');
    if (selectedVal === 'upi') {
      if (step2Heading) step2Heading.innerText = 'Enter UPI ID or Pick Instant App';
      subpanelUpi?.classList.remove('hidden');
    } else if (selectedVal === 'card') {
      if (step2Heading) step2Heading.innerText = 'Enter Debit / Credit Card Details';
      subpanelCard?.classList.remove('hidden');
    } else if (selectedVal === 'netbanking') {
      if (step2Heading) step2Heading.innerText = 'Select Net Banking Bank';
      subpanelNetbanking?.classList.remove('hidden');
    }
  }

  /* Expose updatePaymentView globally so switchPaymentMethod can call it */
  window.updatePaymentView = updatePaymentView;

  radioInputs.forEach(input => {
    input.addEventListener('change', () => updatePaymentView(input.value));
  });

  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const input = card.querySelector('input[type="radio"]');
      if (input && e.target !== input) { input.checked = true; updatePaymentView(input.value); }
    });
  });

  document.querySelectorAll('.bank-pill-card').forEach(card => {
    card.addEventListener('click', () => selectBank(card));
  });

  /* Custom Dropdown Handler */
  function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown').forEach(dd => {
      const menu = dd.querySelector('.dropdown-menu');
      const arrow = dd.querySelector('.dropdown-arrow');
      if (menu) menu.classList.add('hidden');
      if (arrow) arrow.classList.remove('rotate-180');
    });
  }

  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('.dropdown-trigger');
    if (trigger) {
      e.stopPropagation();
      const dropdown = trigger.closest('.custom-dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      const arrow = dropdown.querySelector('.dropdown-arrow');
      const isCurrentlyOpen = !menu.classList.contains('hidden');
      closeAllDropdowns();
      if (!isCurrentlyOpen) {
        menu.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-180');
      }
      return;
    }
    const option = e.target.closest('.dropdown-option');
    if (option) {
      e.stopPropagation();
      const dropdown = option.closest('.custom-dropdown');
      const label = dropdown.querySelector('.dropdown-label');
      const menu = dropdown.querySelector('.dropdown-menu');
      const arrow = dropdown.querySelector('.dropdown-arrow');
      const textSpan = option.querySelector('span:first-child');
      if (label && textSpan) label.innerText = textSpan.innerText.trim();
      dropdown.querySelectorAll('.dropdown-option').forEach(opt => {
        opt.classList.remove('bg-secondary-container/40', 'font-semibold');
        opt.classList.add('font-normal', 'hover:bg-stoneAccent/20');
        const check = opt.querySelector('.check-icon');
        if (check) check.classList.add('hidden');
      });
      option.classList.remove('hover:bg-stoneAccent/20', 'font-normal');
      option.classList.add('bg-secondary-container/40', 'font-semibold');
      const check = option.querySelector('.check-icon');
      if (check) check.classList.remove('hidden');
      if (menu) menu.classList.add('hidden');
      if (arrow) arrow.classList.remove('rotate-180');
      return;
    }
    closeAllDropdowns();
  });
});