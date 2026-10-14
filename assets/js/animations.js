/**
 * HyperScalar Technologies — Animation & Interaction Utilities
 * Provides smooth, subtle scroll reveals respecting prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initBubbleAnimation();
  initHeroCyberVisualizer();
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

/**
 * Interactive Iridescent Bubble Animation for "The Bubbles Media" Link
 */
function initBubbleAnimation() {
  const bubbleLinks = document.querySelectorAll('.bubbles-media-link');
  if (!bubbleLinks.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  bubbleLinks.forEach(link => {
    let intervalId = null;
    let lastMoveTime = 0;

    // Create or locate the particle container
    let container = link.querySelector('.bubble-particle-container');
    if (!container) {
      container = document.createElement('span');
      container.className = 'bubble-particle-container';
      container.setAttribute('aria-hidden', 'true');
      link.appendChild(container);
    }

    function createBubble(offsetX) {
      const bubble = document.createElement('span');
      bubble.className = 'bubble-particle';

      // Random diameter between 9px and 24px
      const size = Math.floor(Math.random() * 16) + 9;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Determine horizontal origin position
      const rect = link.getBoundingClientRect();
      const linkWidth = rect.width || 120;
      let x;
      if (typeof offsetX === 'number') {
        x = Math.max(0, Math.min(linkWidth, offsetX)) + (Math.random() * 14 - 7);
      } else {
        x = Math.random() * linkWidth;
      }

      bubble.style.setProperty('--start-x', `${x.toFixed(1)}px`);

      // Gentle organic sinusoidal sway left and right
      const sway1 = (Math.random() * 16 - 8).toFixed(1);
      const sway2 = (Math.random() * 22 - 11).toFixed(1);
      const sway3 = (Math.random() * 24 - 12).toFixed(1);
      bubble.style.setProperty('--sway-1', `${sway1}px`);
      bubble.style.setProperty('--sway-2', `${sway2}px`);
      bubble.style.setProperty('--sway-3', `${sway3}px`);

      // Random float height and duration
      const riseDistance = Math.floor(Math.random() * 35) + 50; // 50px - 85px upward
      const duration = (Math.random() * 0.55 + 1.15).toFixed(2); // 1.15s - 1.70s
      bubble.style.setProperty('--rise-distance', `-${riseDistance}px`);
      bubble.style.setProperty('--bubble-duration', `${duration}s`);

      container.appendChild(bubble);

      // Self-cleanup upon animation completion
      bubble.addEventListener('animationend', () => {
        bubble.remove();
      });

      // Absolute safety timeout fallback
      setTimeout(() => {
        if (bubble.parentNode) {
          bubble.remove();
        }
      }, 2000);
    }

    function spawnBurst(count = 6) {
      const rect = link.getBoundingClientRect();
      const linkWidth = rect.width || 120;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const randomX = Math.random() * linkWidth;
          createBubble(randomX);
        }, i * 45);
      }
    }

    // Hover start: initial burst + continuous stream
    link.addEventListener('mouseenter', () => {
      spawnBurst(6);
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        createBubble();
      }, 130);
    });

    // Hover end: stop stream, let existing bubbles float away
    link.addEventListener('mouseleave', () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });

    // Track mouse movement across the link to spawn under the cursor
    link.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastMoveTime > 75) {
        lastMoveTime = now;
        const rect = link.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        createBubble(offsetX);
      }
    });

    // Tap/Click celebration burst
    link.addEventListener('click', () => {
      spawnBurst(8);
    });

    // Mobile touch support
    link.addEventListener('touchstart', () => {
      spawnBurst(6);
    }, { passive: true });
  });
}

/**
 * HyperScalar Technologies — Cybernetic Cloud Architecture Visualizer (Matches Picture 1)
 */
function initHeroCyberVisualizer() {
  const heroCard = document.querySelector('.cyber-hero-card');
  if (!heroCard) return;

  const tabPills = heroCard.querySelectorAll('.cyber-tab-pill');
  const cardCloud = document.getElementById('cardCloud');
  const cardDbaas = document.getElementById('cardDbaas');
  const cardMigration = document.getElementById('cardMigration');
  const cardEfficiency = document.getElementById('cardEfficiency');
  const centerBadge = heroCard.querySelector('.cyber-center-badge');

  const modes = {
    cloud: {
      activeCards: [cardCloud, cardEfficiency],
      dimCards: [cardDbaas, cardMigration]
    },
    dbaas: {
      activeCards: [cardDbaas, cardMigration],
      dimCards: [cardCloud, cardEfficiency]
    },
    modernization: {
      activeCards: [cardCloud, cardDbaas, cardMigration, cardEfficiency],
      dimCards: []
    }
  };

  let autoTimer = null;

  function setMode(modeKey, isUserAction = false) {
    const config = modes[modeKey] || modes.modernization;

    // Update tab pills
    tabPills.forEach(pill => {
      const match = pill.getAttribute('data-mode') === modeKey;
      pill.classList.toggle('active', match);
      pill.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Update cards active/dim state
    config.activeCards.forEach(card => {
      if (!card) return;
      card.classList.remove('is-dimmed');
      card.classList.add('is-highlighted');
    });

    config.dimCards.forEach(card => {
      if (!card) return;
      card.classList.remove('is-highlighted');
      card.classList.add('is-dimmed');
    });

    if (isUserAction && autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Bind tab pill clicks
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.getAttribute('data-mode');
      setMode(mode, true);
    });
  });

  // Bind card clicks
  if (cardCloud) {
    cardCloud.addEventListener('click', () => setMode('cloud', true));
  }
  if (cardEfficiency) {
    cardEfficiency.addEventListener('click', () => setMode('cloud', true));
  }
  if (cardDbaas) {
    cardDbaas.addEventListener('click', () => setMode('dbaas', true));
  }
  if (cardMigration) {
    cardMigration.addEventListener('click', () => setMode('dbaas', true));
  }
  if (centerBadge) {
    centerBadge.addEventListener('click', () => setMode('modernization', true));
  }

  // Subtle 3D perspective tilt on mouse movement (desktop only)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(1000px) rotateX(${(-y * 4.5).toFixed(2)}deg) rotateY(${(x * 4.5).toFixed(2)}deg)`;
      heroCard.style.transition = 'transform 0.08s ease-out';
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      heroCard.style.transition = 'transform 0.4s ease-out';
    });
  }

  // Auto cycle smoothly every 6 seconds to show all dimensions
  const modeKeys = ['modernization', 'cloud', 'dbaas'];
  let currentIdx = 0;
  autoTimer = setInterval(() => {
    currentIdx = (currentIdx + 1) % modeKeys.length;
    setMode(modeKeys[currentIdx]);
  }, 6000);
}
