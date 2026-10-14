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
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.replace(/\/index\.html$/, '/').replace(/\.html$/, '');

    if (currentPath === cleanHref || (currentPath === '' && cleanHref === '/') || (currentPath === '/' && cleanHref === '/')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else if (cleanHref !== '/' && currentPath.endsWith(cleanHref)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Seamless static/clean URL resolution:
 * - If viewed directly from filesystem (file://), links point directly to relative .html files.
 * - If running on a local development server without server-side rewrite rules (like python http.server),
 *   links automatically resolve to .html files.
 * - In production environments (Apache, cPanel, Vercel, Netlify), clean URLs are served natively via
 *   .htaccess, vercel.json, and _redirects.
 */
function initEnvironmentRouting() {
  const isLocalFile = window.location.protocol === 'file:';
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalFile || isLocalDev) {
    const routeMap = {
      '/': isLocalFile ? 'index.html' : '/',
      '/services': isLocalFile ? 'services.html' : '/services.html',
      '/dbaasnow': isLocalFile ? 'dbaasnow.html' : '/dbaasnow.html',
      '/growth': isLocalFile ? 'growth.html' : '/growth.html',
      '/about': isLocalFile ? 'about.html' : '/about.html',
      '/contact': isLocalFile ? 'contact.html' : '/contact.html'
    };

    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const href = link.getAttribute('href');
      if (routeMap[href]) {
        link.setAttribute('href', routeMap[href]);
      }
    });
  }
}

/**
 * Contact Form Client-side Validation & Feedback
 */
function initContactForm() {
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  const feedbackBox = document.createElement('div');
  feedbackBox.className = 'form-feedback';
  feedbackBox.setAttribute('role', 'alert');
  form.appendChild(feedbackBox);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const companyInput = form.querySelector('[name="company"]');
    const messageInput = form.querySelector('[name="message"]');

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

    // Success State
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      feedbackBox.className = 'form-feedback success';
      feedbackBox.innerHTML = 'Thank you! Your message has been received. Our team will get back to you shortly.';
      feedbackBox.style.display = 'block';
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send enquiry';
      }
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 600);
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

