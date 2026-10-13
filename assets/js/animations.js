/**
 * HyperScalar Technologies — Animation & Interaction Utilities
 * Provides smooth, subtle scroll reveals respecting prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initBubbleAnimation();
  initHeroArchitectureVisualizer();
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
 * HyperScalar Technologies — Executive Enterprise Topology Console
 */
function initHeroArchitectureVisualizer() {
  const consoleEl = document.querySelector('.enterprise-topology-console');
  if (!consoleEl) return;

  const tabs = consoleEl.querySelectorAll('.console-tab-btn');
  const nodeSource = document.getElementById('nodeSource');
  const nodeCore = document.getElementById('nodeCore');
  const nodeTarget = document.getElementById('nodeTarget');
  const conduit1 = document.getElementById('pathConduit1');
  const conduit2 = document.getElementById('pathConduit2');
  
  const metricLag = document.getElementById('metricLag');
  const metricSla = document.getElementById('metricSla');
  const metricProvision = document.getElementById('metricProvision');
  const metricSavings = document.getElementById('metricSavings');
  const tickerMsg = document.getElementById('consoleTickerMsg');

  const configs = {
    all: {
      activeNodes: [nodeSource, nodeCore, nodeTarget],
      c1Stroke: 'url(#conduitGrad1)',
      c2Stroke: 'url(#conduitGrad2)',
      lag: '0.18 ms',
      sla: '99.999%',
      provision: '< 30 min',
      savings: '-40%',
      ticker: 'HyperScalar Platform: Unified full-estate modernization mesh active across hybrid environments.'
    },
    dbaas: {
      activeNodes: [nodeSource, nodeCore],
      c1Stroke: '#0b5ed0',
      c2Stroke: 'rgba(11, 94, 208, 0.25)',
      lag: '0.04 ms',
      sla: '99.999%',
      provision: '18 min',
      savings: '-45%',
      ticker: 'DBaasNow™ Engine: Continuous zero-downtime replication active across Oracle & SQL Server clusters.'
    },
    cloud: {
      activeNodes: [nodeCore, nodeTarget],
      c1Stroke: 'rgba(11, 94, 208, 0.25)',
      c2Stroke: '#0284c7',
      lag: '0.12 ms',
      sla: '99.999%',
      provision: '< 15 min',
      savings: '-42%',
      ticker: 'Hyperscale Cloud Mesh: Multi-region auto-scaling deployed across AWS, Azure, and Google Cloud.'
    }
  };

  let autoCycleTimer = null;

  function applyPerspective(key, isUserClick = false) {
    const cfg = configs[key] || configs.all;

    // Update active tab button
    tabs.forEach(tab => {
      const match = tab.getAttribute('data-pillar') === key;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Update node styles
    [nodeSource, nodeCore, nodeTarget].forEach(node => {
      if (!node) return;
      const isActive = cfg.activeNodes.includes(node);
      node.style.opacity = isActive ? '1' : '0.5';
      node.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    // Update SVG conduits
    if (conduit1) conduit1.setAttribute('stroke', cfg.c1Stroke);
    if (conduit2) conduit2.setAttribute('stroke', cfg.c2Stroke);

    // Update metrics with subtle update
    if (metricLag) metricLag.textContent = cfg.lag;
    if (metricSla) metricSla.textContent = cfg.sla;
    if (metricProvision) metricProvision.textContent = cfg.provision;
    if (metricSavings) metricSavings.textContent = cfg.savings;

    // Update ticker text with smooth fade
    if (tickerMsg) {
      tickerMsg.style.opacity = '0';
      setTimeout(() => {
        tickerMsg.textContent = cfg.ticker;
        tickerMsg.style.opacity = '1';
      }, 150);
    }

    if (isUserClick && autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  }

  // Bind tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const p = tab.getAttribute('data-pillar');
      applyPerspective(p, true);
    });
  });

  // Also bind clicking on the cards themselves
  if (nodeSource) {
    nodeSource.style.cursor = 'pointer';
    nodeSource.addEventListener('click', () => applyPerspective('dbaas', true));
  }
  if (nodeCore) {
    nodeCore.style.cursor = 'pointer';
    nodeCore.addEventListener('click', () => applyPerspective('all', true));
  }
  if (nodeTarget) {
    nodeTarget.style.cursor = 'pointer';
    nodeTarget.addEventListener('click', () => applyPerspective('cloud', true));
  }

  // Auto-cycling every 6 seconds to demonstrate breadth
  const keys = ['all', 'dbaas', 'cloud'];
  let currentIdx = 0;
  autoCycleTimer = setInterval(() => {
    currentIdx = (currentIdx + 1) % keys.length;
    applyPerspective(keys[currentIdx]);
  }, 5500);

  // Subtle interactive 3D perspective tilt on hover for enterprise polish
  consoleEl.addEventListener('mousemove', (e) => {
    const rect = consoleEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    consoleEl.style.transform = `perspective(1000px) rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 3.5).toFixed(2)}deg)`;
    consoleEl.style.transition = 'transform 0.1s ease-out';
  });

  consoleEl.addEventListener('mouseleave', () => {
    consoleEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    consoleEl.style.transition = 'transform 0.4s ease-out';
  });
}
