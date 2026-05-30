/* ═══════════════════════════════════════════
   Tech Jagannath – main.js
════════════════════════════════════════════ */

'use strict';

// ─── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');

const handleNavbarScroll = () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


// ─── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
  const isOpen = navbar.classList.contains('menu-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});


// ─── Scroll-triggered animations ──────────────────────────
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, delay * 1000);
      observer.unobserve(el);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));


// ─── Counter animation ─────────────────────────────────────
const counterEls = document.querySelectorAll('[data-count]');

const easeOutQuad = t => t * (2 - t);

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = el.dataset.decimal;
  const duration = 1800;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuad(progress);
    let current = target * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
    }
  };

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counterEls.forEach(el => counterObserver.observe(el));


// ─── Products slider ───────────────────────────────────────
const productsTrack = document.getElementById('productsTrack');
const prodPrev = document.getElementById('prodPrev');
const prodNext = document.getElementById('prodNext');

let prodScrollAmount = 280;

prodNext.addEventListener('click', () => {
  productsTrack.scrollBy({ left: prodScrollAmount, behavior: 'smooth' });
});

prodPrev.addEventListener('click', () => {
  productsTrack.scrollBy({ left: -prodScrollAmount, behavior: 'smooth' });
});

// Update nav button states
const updateProdNavBtns = () => {
  prodPrev.style.opacity = productsTrack.scrollLeft <= 0 ? '0.4' : '1';
  const maxScroll = productsTrack.scrollWidth - productsTrack.clientWidth;
  prodNext.style.opacity = productsTrack.scrollLeft >= maxScroll - 2 ? '0.4' : '1';
};

productsTrack.addEventListener('scroll', updateProdNavBtns, { passive: true });
updateProdNavBtns();


// ─── Active nav link on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(section => sectionObserver.observe(section));


// ─── Smooth scroll for all anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ─── Orbit icon hover ripple ───────────────────────────────
document.querySelectorAll('.orbit-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.zIndex = '20';
  });
  item.addEventListener('mouseleave', () => {
    item.style.zIndex = '5';
  });
});


// ─── Service card stagger on load ─────────────────────────
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.06}s`;
});


// ─── Process step highlight ───────────────────────────────
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    processSteps.forEach((s, j) => {
      const dist = Math.abs(i - j);
      s.style.opacity = dist === 0 ? '1' : dist === 1 ? '0.75' : '0.5';
    });
  });
  step.addEventListener('mouseleave', () => {
    processSteps.forEach(s => (s.style.opacity = '1'));
  });
});


// ─── Parallax on hero ─────────────────────────────────────
const heroCube = document.querySelector('.hero-cube');
const heroVisual = document.querySelector('.hero-visual');

if (heroVisual) {
  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20;
    const y = (e.clientY / innerHeight - 0.5) * 20;
    if (heroCube) {
      heroCube.style.transform = `translate(calc(-50% + ${x * 0.5}px), calc(-50% + ${y * 0.5}px)) scale(1)`;
    }
    document.querySelectorAll('.orbit-item').forEach((item, i) => {
      const factor = (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.1);
      item.style.transform = `${item.style.transform.split('translate')[0]} translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}


// ─── Typed effect for hero subtitle ───────────────────────
const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  const originalText = heroDesc.textContent;
  const words = ['software', 'IoT devices', 'automation systems', 'AI-powered solutions'];
  let wordIndex = 0;

  // Simple fade word swap (non-destructive)
  const wordEls = document.querySelectorAll('.hero-tags .tag');
  let tagIndex = 0;

  setInterval(() => {
    wordEls.forEach(el => el.style.opacity = '0.6');
    wordEls[tagIndex % wordEls.length].style.opacity = '1';
    tagIndex++;
  }, 1800);
}


// ─── Page load reveal ─────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
