document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Theme toggle (dark/light, persisted) ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0c12' : '#ffffff');
}

// The initial theme is applied by the inline script in <head> before first paint.
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  // Storage can throw when site data is blocked; the toggle still works for this visit.
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ---------- Reveal-on-scroll animation ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  revealObserver.observe(el);
});

/* ---------- Interactive tilt effect on project cards ---------- */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Project case study data ---------- */
const caseStudies = {
  goto: {
    tags: ['React.js', 'Node.js', 'Express.js', 'REST APIs', 'OAuth 2.0', 'JWT'],
    title: 'GoTo Resolve Integration',
    overview: 'A full stack integration connecting Freshservice with GoTo Resolve, allowing IT support agents to launch remote support sessions directly from a support ticket — no context switching required.',
    role: 'Built both the React.js frontend and Node.js/Express.js middleware end to end.',
    highlights: [
      'Node.js/Express.js backend authenticates with the GoTo Resolve REST API, generates a scoped session, and returns a signed URL to the React frontend.',
      'Implemented secure server-side OAuth 2.0 and JWT token management so credentials never touch the client.',
      'Session logs are written back to the originating Freshservice ticket automatically on completion.',
      'Built custom React components with real-time session status updates and auto-populated device fields from CMDB data.'
    ]
  },
  dashboard: {
    tags: ['React.js', 'Redux', 'Context API', 'JavaScript', 'REST APIs', 'CSS3'],
    title: 'Production Monitoring Dashboard',
    overview: 'A real-time production monitoring dashboard built for LMW Cots and Aprons to track manufacturing output and enforce role-based access across shop-floor and management views.',
    role: 'Owned the frontend architecture end to end — state management, access control, and performance.',
    highlights: [
      'Implemented real-time production tracking and barcode/QR-based product tracking using React Hooks and REST APIs.',
      'Designed a PermissionContext with the Context API for role-gated UI rendering, with access enforced server-side as well.',
      'Used Redux for predictable state management across a multi-view dashboard.',
      'Optimized rendering performance with React.memo and memoized selectors for smooth real-time updates.'
    ]
  },
  maas360: {
    tags: ['React.js', 'Node.js', 'REST APIs', 'OAuth 2.0', 'Bootstrap'],
    title: 'IBM MaaS360 Integration',
    overview: 'An enterprise integration surfacing real-time device compliance, health, and inventory data from IBM MaaS360 directly inside Freshservice tickets and CMDB records.',
    role: 'Built the React.js frontend and the serverless backend functions powering the data sync.',
    highlights: [
      'Built React.js frontend components rendering real-time device compliance and inventory visibility inside Freshservice.',
      'Developed serverless backend functions transforming MaaS360 API data into Freshservice CMDB records.',
      'Implemented OAuth 2.0 authentication and idempotent, event-driven automation workflows to keep data in sync.',
      'Designed reusable data-display components later reused across other MDM integrations.'
    ]
  },
  intune: {
    tags: ['React.js', 'JavaScript', 'Azure AD', 'OAuth 2.0', 'REST APIs'],
    title: 'Microsoft Intune & VMware AirWatch Integrations',
    overview: 'Two parallel MDM integrations bringing Microsoft Intune and VMware AirWatch device data and compliance status directly into Freshservice support tickets.',
    role: 'Built the shared React.js frontend patterns and authentication layer reused across both integrations.',
    highlights: [
      'Built React.js frontend apps surfacing device data and compliance status from Intune and AirWatch inside Freshservice tickets.',
      'Implemented OAuth 2.0 via Azure AD for secure, tenant-aware authentication.',
      'Built serverless automation rules for near real-time CMDB synchronization.',
      'Established shared React component patterns, cutting duplicate work across both integrations.'
    ]
  }
};

/* ---------- Case study modal ---------- */
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
let lastFocused = null;

function openModal(key) {
  const cs = caseStudies[key];
  if (!cs) return;
  modalContent.innerHTML = `
    <div class="project-tags">${cs.tags.map(t => `<span>${t}</span>`).join('')}</div>
    <h2 id="modalTitle">${cs.title}</h2>
    <p>${cs.overview}</p>
    <h4>My Role</h4>
    <p>${cs.role}</p>
    <h4>Key Contributions</h4>
    <ul>${cs.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
  `;
  lastFocused = document.activeElement;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function isModalOpen() {
  return modalOverlay.classList.contains('open');
}

function closeModal() {
  if (!isModalOpen()) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
  lastFocused = null;
}

// Keep Tab / Shift+Tab inside the open modal.
function trapFocus(e) {
  const focusables = modalOverlay.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && (document.activeElement === first || !modalOverlay.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !modalOverlay.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
}

document.querySelectorAll('[data-open]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.open));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.open);
    }
  });
});
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (!isModalOpen()) return;
  if (e.key === 'Escape') closeModal();
  else if (e.key === 'Tab') trapFocus(e);
});

/* ---------- Contact form submission (Formspree) ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.form-submit');
  const formData = new FormData(contactForm);

  // Until a real Formspree ID is set in index.html, hand the message to the
  // visitor's email app so the form still works.
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    const mailLink = document.querySelector('a[href^="mailto:"]');
    const to = mailLink ? mailLink.getAttribute('href').replace(/^mailto:/, '') : '';
    const subject = formData.get('subject') || 'Hello';
    const body = `${formData.get('message')}\n\n— ${formData.get('name')} (${formData.get('email')})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = 'Opening your email app to send this message…';
    formStatus.className = 'form-status';
    return;
  }

  submitBtn.disabled = true;
  formStatus.textContent = 'Sending...';
  formStatus.className = 'form-status';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      formStatus.textContent = "Message sent — thanks for reaching out! I'll reply soon.";
      formStatus.className = 'form-status success';
      contactForm.reset();
      burstConfetti(submitBtn);
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please email me directly instead.';
    formStatus.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
  }
});

/* ============================================================
   Extra effects: scroll progress, spotlight, ripple, count-up,
   confetti, scramble-reveal
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------- Hero cursor spotlight ---------- */
const heroEl = document.getElementById('home');
if (heroEl && window.matchMedia('(pointer: fine)').matches) {
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroEl.style.setProperty('--spot-x', `${x}%`);
    heroEl.style.setProperty('--spot-y', `${y}%`);
    heroEl.classList.add('spotlight-active');
  });
  heroEl.addEventListener('mouseleave', () => heroEl.classList.remove('spotlight-active'));
}

/* ---------- Button ripple ---------- */
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ---------- Count-up numbers (e.g. "5+ yrs" badge) ---------- */
function animateCountUp(el, target, duration = 1200) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('.count-up');
if (countEls.length) {
  if (prefersReducedMotion) {
    countEls.forEach(el => { el.textContent = el.dataset.target; });
  } else {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target, parseInt(entry.target.dataset.target, 10));
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObserver.observe(el));
  }
}

/* ---------- Confetti burst ---------- */
function burstConfetti(originEl) {
  if (prefersReducedMotion || !originEl) return;
  const rect = originEl.getBoundingClientRect();
  const colors = ['#5b5bd6', '#14b8a6', '#8b8cf9', '#2dd4bf'];
  for (let i = 0; i < 26; i++) {
    const particle = document.createElement('span');
    particle.className = 'confetti-particle';
    particle.style.left = (rect.left + rect.width / 2) + 'px';
    particle.style.top = (rect.top + rect.height / 2) + 'px';
    particle.style.background = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 100;
    particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

/* ---------- Scramble-reveal for hero role text ---------- */
function scrambleReveal(el, finalText, duration = 900) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&*+-/';
  const frameRate = 30;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let frame = 0;
  const timer = setInterval(() => {
    frame++;
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i];
      if (ch === ' ' || ch === '\u00A0') { out += ch; continue; }
      const revealAt = (i / finalText.length) * totalFrames;
      out += frame >= revealAt ? ch : chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = out;
    if (frame >= totalFrames) {
      el.textContent = finalText;
      clearInterval(timer);
    }
  }, 1000 / frameRate);
}
const scrambleEl = document.querySelector('.scramble-text');
if (scrambleEl && !prefersReducedMotion) {
  const originalText = scrambleEl.textContent;
  window.addEventListener('load', () => {
    setTimeout(() => scrambleReveal(scrambleEl, originalText), 400);
  });
}
