// scroll progress bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
});

// cursor glow
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
}

// particles canvas
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// navbar glassmorphism on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// project card tilt effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// theme toggle

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => { themeToggle.style.transform = 'scale(1)'; }, 150);
});

// mobile nav
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      const navH = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    }
  });
});

// highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
});

// back to top
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backBtn.classList.toggle('visible', window.scrollY > 500);
});
backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// scroll animations
function initScrollReveal() {
  const items = document.querySelectorAll('.animate-on-scroll');

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => observer.observe(el));

  // catch elements already in view
  setTimeout(() => {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', initScrollReveal);
window.addEventListener('load', initScrollReveal);

// skill bars animation
function animateSkills() {
  const skillItems = document.querySelectorAll('.skill-item');

  if (!('IntersectionObserver' in window)) {
    skillItems.forEach(item => {
      item.classList.add('visible');
      const bar = item.querySelector('.skill-progress');
      if (bar) bar.style.width = bar.getAttribute('data-progress') + '%';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-progress');
        const val = bar ? bar.getAttribute('data-progress') : 0;
        entry.target.classList.add('visible');
        setTimeout(() => {
          if (bar) bar.style.width = val + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  skillItems.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', animateSkills);
window.addEventListener('load', animateSkills);

// contact form
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput = document.getElementById('message');
  const submitBtn = contactForm.querySelector('.btn-submit');
  const formMsg = document.getElementById('formMessage');
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkName = v => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Too short' : '';
  const checkEmail = v => !v.trim() ? 'Email is required' : !emailReg.test(v) ? 'Enter a valid email' : '';
  const checkMsg = v => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'Message too short' : '';

  function attachValidation(input, errorEl, fn) {
    input.addEventListener('blur', () => {
      const err = fn(input.value);
      errorEl.textContent = err;
      input.style.borderColor = err ? '#ef4444' : 'var(--accent-primary)';
    });
    input.addEventListener('input', () => {
      if (errorEl.textContent) {
        const err = fn(input.value);
        errorEl.textContent = err;
        if (!err) input.style.borderColor = 'var(--accent-primary)';
      }
    });
  }

  attachValidation(nameInput, document.getElementById('nameError'), checkName);
  attachValidation(emailInput, document.getElementById('emailError'), checkEmail);
  attachValidation(msgInput, document.getElementById('messageError'), checkMsg);

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const e1 = checkName(nameInput.value);
    const e2 = checkEmail(emailInput.value);
    const e3 = checkMsg(msgInput.value);

    document.getElementById('nameError').textContent = e1;
    document.getElementById('emailError').textContent = e2;
    document.getElementById('messageError').textContent = e3;

    if (e1 || e2 || e3) {
      if (e1) nameInput.style.borderColor = '#ef4444';
      if (e2) emailInput.style.borderColor = '#ef4444';
      if (e3) msgInput.style.borderColor = '#ef4444';
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formMsg.style.display = 'none';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      if (res.ok) {
        formMsg.textContent = "✓ Message sent! I'll get back to you within 24 hours.";
        formMsg.className = 'form-message success';
        formMsg.style.display = 'block';
        contactForm.reset();
        [nameInput, emailInput, msgInput].forEach(i => { i.style.borderColor = 'transparent'; });
        setTimeout(() => { formMsg.style.display = 'none'; }, 5000);
      } else {
        formMsg.textContent = '✗ Something went wrong. Try emailing me directly.';
        formMsg.className = 'form-message error';
        formMsg.style.display = 'block';
      }
    } catch (err) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      formMsg.textContent = '✗ Network error. Check your connection.';
      formMsg.className = 'form-message error';
      formMsg.style.display = 'block';
    }
  });
}

// typed.js - hero title animation
if (typeof Typed !== 'undefined') {
  const el = document.querySelector('.typing-text');
  if (el) {
    new Typed('.typing-text', {
      strings: ['Stunning Websites', 'Fast Landing Pages', 'Clean UI Designs', 'Modern Portfolios'],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      cursorChar: '|'
    });
  }
}

// magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});


// counter animation for hero stats
function animateCounter(el, target, duration) {
  if (isNaN(target)) return;
  const suffix = el.dataset.original.replace(/[0-9]/g, '');
  let current = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

function initCounters() {
  const nums = document.querySelectorAll('.stat-number');
  nums.forEach(el => { el.dataset.original = el.textContent.trim(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const raw = entry.target.dataset.original;
        const val = parseInt(raw.replace(/\D/g, ''), 10);
        animateCounter(entry.target, val, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);

// debounce scroll events a bit
function debounce(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
window.addEventListener('scroll', debounce(updateActiveLink, 50));

// lazy load images
function lazyLoadImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// page load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
});
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// copyright year
const yearEl = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// keyboard nav
document.addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

// konami code easter egg (just for fun)
let keys = [];
const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', e => {
  keys.push(e.key);
  keys = keys.slice(-code.length);
  if (keys.join('') === code.join('')) {
    const style = document.createElement('style');
    style.textContent = `@keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
    document.head.appendChild(style);
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
      document.body.style.animation = '';
      style.remove();
    }, 5000);
  }
});

// console message
console.log('%c👨‍💻 Hey there!', 'color: #00d4ff; font-size: 18px; font-weight: bold;');
console.log('%cLooking for a developer? Let\'s connect → ankitdevx.26@gmail.com', 'color: #fff; background: #0099ff; padding: 8px 12px; border-radius: 4px;');
