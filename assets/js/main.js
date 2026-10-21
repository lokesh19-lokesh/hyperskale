/**
 * HyperScalar Technologies — Main JavaScript
 * Handles accessible mobile navigation, active states, contact form validation,
 * and seamless routing for clean URLs across static and web environments.
 */

function initApp() {
  initEnvironmentRouting();
  initMobileNavigation();
  initActiveNav();
  initContactForm();
  initStickyHeader();
  initFloatingActions();
}

/**
 * Enhanced Sticky Header on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Mobile Navigation Drawer & Accessibility
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first link in drawer
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking mobile links
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/**
 * Set active navigation item based on current page URL
 */
function initActiveNav() {
  const currentPath = window.location.pathname
    .replace(/\/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '');
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href
      .replace(/\/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '');

    const isMatch = (currentPath === cleanHref) ||
      (currentPath === '' && (cleanHref === '' || cleanHref === '/')) ||
      (cleanHref !== '' && cleanHref !== '/' && currentPath.endsWith(cleanHref));

    if (isMatch) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Seamless static/clean URL resolution:
 * Handles:
 * 1. GitHub Pages (e.g., https://username.github.io/repo-name/):
 *    - Automatically detects repository subfolder from URL pathname.
 *    - Replaces root-relative links (/services) with repo-relative static links (/repo-name/services.html)
 *      so navigation NEVER jumps to username.github.io/services (which causes 404).
 * 2. Local filesystem (file://):
 *    - Replaces root-relative links with relative .html files.
 * 3. Local dev server without URL rewrite (e.g. python -m http.server):
 *    - Appends .html to root-relative routes so static dev servers work out-of-the-box.
 * 4. Fallback link click interceptor:
 *    - Intercepts clicks on internal links to guarantee proper routing even if dynamically loaded.
 */
function initEnvironmentRouting() {
  const isLocalFile = window.location.protocol === 'file:';
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isGitHubPages = window.location.hostname.endsWith('github.io');

  // Detect repository base path on GitHub Pages (e.g., '/hyperskale')
  let repoBase = '';
  if (isGitHubPages) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && !segments[0].endsWith('.html')) {
      repoBase = '/' + segments[0];
    }
  }

  const cleanRoutes = ['services', 'dbaasnow', 'growth', 'about', 'contact'];

  function resolveRoute(href) {
    if (!href || !href.startsWith('/')) return href;

    // Normalizing root route
    if (href === '/' || href === '/index' || href === '/index.html') {
      if (isLocalFile) return 'index.html';
      if (isGitHubPages) return repoBase ? `${repoBase}/index.html` : '/index.html';
      return '/';
    }

    // Match against known pages
    for (const route of cleanRoutes) {
      if (href === `/${route}` || href === `/${route}/` || href === `/${route}.html`) {
        if (isLocalFile) return `${route}.html`;
        if (isGitHubPages) return `${repoBase}/${route}.html`;
        if (isLocalDev) return `/${route}.html`;
        return `/${route}`;
      }
    }

    // For any other root-relative link on GitHub Pages, prepend repoBase
    if (isGitHubPages && repoBase && !href.startsWith(repoBase + '/')) {
      return repoBase + href;
    }

    return href;
  }

  // Update all existing link elements
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    const rawHref = link.getAttribute('href');
    const resolved = resolveRoute(rawHref);
    if (resolved && resolved !== rawHref) {
      link.setAttribute('href', resolved);
    }
  });

  // Global click interception fallback for bulletproof navigation
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    if (isGitHubPages || isLocalFile || isLocalDev) {
      if (href.startsWith('/') && !href.startsWith(repoBase + '/') && repoBase) {
        e.preventDefault();
        const target = resolveRoute(href);
        window.location.href = target;
      }
    }
  });
}

/**
 * Contact Form Client-side Validation & Email Submission
 * Submits form data to connect.hyperscalar@gmail.com via FormSubmit AJAX
 */
function initContactForm() {
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  const feedbackBox = document.createElement('div');
  feedbackBox.className = 'form-feedback';
  feedbackBox.setAttribute('role', 'alert');
  form.appendChild(feedbackBox);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const companyInput = form.querySelector('[name="company"]');
    const countryInput = form.querySelector('[name="country"]');
    const interestSelect = form.querySelector('[name="interest"]');
    const messageInput = form.querySelector('[name="message"]');
    const honeyInput = form.querySelector('[name="_honey"]');

    // Honeypot spam check: if filled by automated bots, reject silently
    if (honeyInput && honeyInput.value) {
      return;
    }

    let errors = [];

    if (!nameInput || !nameInput.value.trim()) {
      errors.push('Full name is required.');
    }

    if (!emailInput || !emailInput.value.trim()) {
      errors.push('Work email is required.');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errors.push('Please enter a valid work email address.');
      }
    }

    if (!companyInput || !companyInput.value.trim()) {
      errors.push('Company name is required.');
    }

    if (!messageInput || !messageInput.value.trim()) {
      errors.push('Please tell us how we can help.');
    }

    if (errors.length > 0) {
      feedbackBox.className = 'form-feedback error';
      feedbackBox.innerHTML = errors.join('<br/>');
      feedbackBox.style.display = 'block';
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Local file protocol warning
    if (window.location.protocol === 'file:') {
      feedbackBox.className = 'form-feedback error';
      feedbackBox.innerHTML = '<strong>Notice:</strong> Email form services (FormSubmit) require pages to be accessed via a web server (such as <code>http://localhost:8080</code> or your deployed website URL). Forms cannot be submitted from <code>file:///</code> links.';
      feedbackBox.style.display = 'block';
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Loading State
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Send enquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-inline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </span>
        Sending enquiry...
      `;
    }

    feedbackBox.style.display = 'none';

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim(),
      country: countryInput ? countryInput.value.trim() : '',
      interest: interestSelect ? interestSelect.value : '',
      message: messageInput.value.trim(),
      _subject: `New Contact Enquiry from ${nameInput.value.trim()} (${companyInput.value.trim()})`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/connect.hyperscalar@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (data && (data.success === 'true' || data.success === true)) {
        feedbackBox.className = 'form-feedback success';
        feedbackBox.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. Our team will get back to you shortly.';
        feedbackBox.style.display = 'block';
        form.reset();
      } else if (data && data.message && (data.message.toLowerCase().includes('activate') || data.message.toLowerCase().includes('activation'))) {
        feedbackBox.className = 'form-feedback error';
        feedbackBox.innerHTML = '<strong>Form Activation Required:</strong> A one-time activation email has been sent to <strong>connect.hyperscalar@gmail.com</strong>.<br/>Please check your inbox (including <em>Promotions</em>, <em>Spam</em>, or <em>All Mail</em>) and click the <strong>"Activate Form"</strong> button to enable submissions.';
        feedbackBox.style.display = 'block';
      } else {
        throw new Error(data && data.message ? data.message : 'Submission failed.');
      }
    } catch (err) {
      feedbackBox.className = 'form-feedback error';
      feedbackBox.innerHTML = `<strong>Error sending message:</strong> ${err.message || 'Please check your internet connection'}.<br/>Alternatively, please email us directly at <a href="mailto:connect.hyperscalar@gmail.com" style="text-decoration: underline; color: inherit; font-weight: 600;">connect.hyperscalar@gmail.com</a>.`;
      feedbackBox.style.display = 'block';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/**
 * Floating Actions: WhatsApp Direct Chat & Smooth Scroll-To-Top Button
 */
function initFloatingActions() {
  let dock = document.querySelector('.floating-actions-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.className = 'floating-actions-dock';
    dock.setAttribute('role', 'region');
    dock.setAttribute('aria-label', 'Floating quick actions');
    dock.innerHTML = `
      <!-- WhatsApp Floating Chat Button -->
      <a href="https://wa.me/918341823833?text=Hi%20HyperScalar%20Technologies%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20services."
        class="fab-btn fab-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp (+91 83418 23833)">
        <span class="fab-whatsapp-pulse" aria-hidden="true"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.031 2C6.51 2 2.031 6.478 2.031 11.997c0 1.84.5 3.565 1.373 5.053L2 22l5.12-1.344a9.93 9.93 0 0 0 4.911 1.282h.004c5.52 0 9.998-4.478 9.998-9.997 0-2.671-1.04-5.182-2.929-7.071A9.94 9.94 0 0 0 12.031 2zm0 18.257a8.27 8.27 0 0 1-4.218-1.154l-.302-.18-3.136.823.837-3.056-.197-.314a8.25 8.25 0 0 1-1.267-4.38c0-4.57 3.72-8.287 8.287-8.287 2.213 0 4.294.863 5.86 2.428a8.23 8.23 0 0 1 2.424 5.859c0 4.57-3.72 8.287-8.288 8.287zm4.542-6.198c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.644.809-.789.975-.145.166-.29.187-.539.062a6.786 6.786 0 0 1-2.001-1.233 7.488 7.488 0 0 1-1.385-1.724c-.145-.249-.015-.384.11-.508.112-.112.249-.29.373-.436.124-.145.166-.249.249-.415.083-.166.042-.311-.021-.436-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428h-.477c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.753 2.678 4.248 3.755.594.256 1.058.41 1.42.525.597.19 1.14.163 1.57.099.479-.071 1.472-.602 1.68-1.183.208-.581.208-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
        </svg>
        <span class="fab-tooltip">Chat with us</span>
      </a>

      <!-- Up Scrolled / Scroll to Top Button -->
      <button type="button"
        id="scrollTopBtn"
        class="fab-btn fab-scroll-top"
        aria-label="Scroll to top of page">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-up" aria-hidden="true">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    `;
    document.body.appendChild(dock);
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    function handleScroll() {
      if (window.scrollY > 280) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

