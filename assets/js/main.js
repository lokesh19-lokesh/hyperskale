/**
 * HyperSkale Consulting — Main JavaScript
 * Handles accessible mobile navigation, active states, contact form validation,
 * and seamless routing for clean URLs across static and web environments.
 */

function initApp() {
  initEnvironmentRouting();
  initMobileNavigation();
  initActiveNav();
  initContactForm();
  initStickyHeader();
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
