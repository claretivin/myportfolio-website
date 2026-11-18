/* Claret Ivin R portfolio: theme, phone menu, live local time, section entrances, contact form */

const root = document.documentElement;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Theme toggle (light/dark, remembered) ---------- */
// The starting theme is set by the inline script in <head> before first paint.
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'dark' ? '#161615' : '#F2F2EF');
  // Storage can throw when site data is blocked; the toggle still works for this visit.
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

/* ---------- Phone menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  navToggle.textContent = open ? 'Close' : 'Menu';
}
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); navToggle.focus(); }
});

/* ---------- Nagercoil local time, live ---------- */
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = `${fmt.format(new Date())} IST`; };
tick();
setInterval(tick, 30000);

/* ---------- Section entrances: the parts of each section, staggered ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('section').forEach(s => {
  s.querySelectorAll('.rise').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 75}ms`;
    io.observe(el);
  });
});

/* ---------- Contact form (Formspree, with an email fallback) ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const data = new FormData(contactForm);

  // Until a real Formspree ID is set in index.html, hand the message to the visitor's email app.
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    const to = 'claretivin711@gmail.com';
    const subject = data.get('subject') || 'Hello';
    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = 'Opening your email app to send this message…';
    return;
  }

  submitBtn.disabled = true;
  formStatus.textContent = 'Sending…';
  try {
    const res = await fetch(contactForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Submission failed');
    formStatus.textContent = 'Message sent. Thanks, I will reply soon.';
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = 'That did not go through. Please email me directly instead.';
  } finally {
    submitBtn.disabled = false;
  }
});
