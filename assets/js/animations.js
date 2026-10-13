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
 * HyperScalar Technologies — Interactive Enterprise Architecture Engine
 */
function initHeroArchitectureVisualizer() {
  const canvas = document.getElementById('heroNetworkCanvas');
  const wrapper = document.querySelector('.hero-animation-wrapper');
  const stage = document.getElementById('heroAnimStage');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId = null;
  let isVisible = true;
  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mouse tracking for parallax & canvas interaction
  const mouse = { x: -1000, y: -1000, isOver: false };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate constellation nodes
  const nodeCount = 26;
  const nodes = [];
  const palette = [
    'rgba(56, 189, 248, ',  // sky cyan
    'rgba(11, 94, 208, ',   // brand royal blue
    'rgba(147, 197, 253, ', // soft blue
    'rgba(255, 255, 255, '  // pure white highlight
  ];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.5,
      colorPrefix: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.5 + 0.45,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.03 + 0.015
    });
  }

  // Active packet pulses travelling along connection lines
  const packets = [];
  function maybeSpawnPacket(n1, n2) {
    if (Math.random() < 0.015 && packets.length < 8) {
      packets.push({
        x1: n1.x, y1: n1.y,
        x2: n2.x, y2: n2.y,
        progress: 0,
        speed: Math.random() * 0.02 + 0.015
      });
    }
  }

  function render() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Update & draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // Natural movement
      n.x += n.vx;
      n.y += n.vy;

      // Gentle bounds bouncing
      if (n.x < 10) { n.x = 10; n.vx *= -1; }
      else if (n.x > width - 10) { n.x = width - 10; n.vx *= -1; }
      if (n.y < 10) { n.y = 10; n.vy *= -1; }
      else if (n.y > height - 10) { n.y = height - 10; n.vy *= -1; }

      // Mouse attraction if hovering
      if (mouse.isOver) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 5) {
          n.x += (dx / dist) * 0.5;
          n.y += (dy / dist) * 0.5;
        }
      }

      // Draw connections
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
        const maxDist = 95;
        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();

          maybeSpawnPacket(n, n2);
        }
      }

      // Draw node glow
      n.pulse += n.pulseSpeed;
      const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
      ctx.beginPath();
      ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `${n.colorPrefix}${n.alpha})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    // Render data packets
    for (let k = packets.length - 1; k >= 0; k--) {
      const p = packets[k];
      p.progress += p.speed;
      if (p.progress >= 1) {
        packets.splice(k, 1);
        continue;
      }
      const curX = p.x1 + (p.x2 - p.x1) * p.progress;
      const curY = p.y1 + (p.y2 - p.y1) * p.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Interactive 3D parallax on stage
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isOver = true;

    if (stage) {
      const xPercent = (mouse.x / rect.width) - 0.5;
      const yPercent = (mouse.y / rect.height) - 0.5;
      const tiltX = -yPercent * 9;
      const tiltY = xPercent * 9;
      stage.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    mouse.isOver = false;
    mouse.x = -1000;
    mouse.y = -1000;
    if (stage) {
      stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  });

  // Pillar mode switcher & telemetry storytelling
  const pillButtons = wrapper.querySelectorAll('.anim-pill-btn');
  const tickerText = document.getElementById('heroTickerText');
  const badges = {
    cloud: [document.getElementById('badgeCloud')],
    dbaas: [document.getElementById('badgeDbaas')],
    modernize: [document.getElementById('badgeMigration'), document.getElementById('badgeEfficiency')]
  };

  const stories = {
    cloud: 'HyperScalar Cloud: Multi-Region 99.999% SLA Auto-Scaling Active',
    dbaas: 'DBaasNow Engine: Automated Zero-Downtime Database Ops (< 30 min)',
    modernize: 'Modernization Core: 40% Cost Drag Reduction & Live Cutover'
  };

  const pillarKeys = ['cloud', 'dbaas', 'modernize'];
  let currentPillarIdx = 0;
  let autoCycleTimer = null;

  function setPillar(key, isManual = false) {
    if (isManual && autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }

    pillButtons.forEach(btn => {
      const active = btn.getAttribute('data-pillar') === key;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Highlight corresponding badges
    Object.keys(badges).forEach(k => {
      badges[k].forEach(b => {
        if (!b) return;
        b.classList.toggle('is-highlighted', k === key);
      });
    });

    if (tickerText && stories[key]) {
      tickerText.style.opacity = '0';
      setTimeout(() => {
        tickerText.textContent = stories[key];
        tickerText.style.opacity = '1';
        tickerText.style.transition = 'opacity 0.25s ease';
      }, 150);
    }
  }

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-pillar');
      setPillar(p, true);
    });
  });

  // Badges can also be clicked directly!
  Object.keys(badges).forEach(k => {
    badges[k].forEach(badge => {
      if (!badge) return;
      badge.addEventListener('click', () => {
        setPillar(k, true);
      });
    });
  });

  // Auto-cycle through pillars every 5 seconds to tell the full story
  autoCycleTimer = setInterval(() => {
    currentPillarIdx = (currentPillarIdx + 1) % pillarKeys.length;
    setPillar(pillarKeys[currentPillarIdx]);
  }, 4800);

  // Pause rendering when off-screen to preserve battery & CPU
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          render();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.05 });

    observer.observe(wrapper);
  }

  // Initial kick-off
  render();
}
