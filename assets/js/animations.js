/**
 * HyperScalar Technologies — Animation & Interaction Utilities
 * Provides smooth, subtle scroll reveals respecting prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

function initScrollAnimations() {
  // If user prefers reduced motion, do not attach animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Select key cards and sections
  const animatedElements = document.querySelectorAll(
    '.service-card, .work-step-item, .stat-item, .contact-aside-box, .stats-grid-dbaas > div'
  );

  if (!('IntersectionObserver' in window)) {
    return;
  }

  // Apply base transition style
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  animatedElements.forEach(el => observer.observe(el));
}
