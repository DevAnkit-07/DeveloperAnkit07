// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => { themeToggle.style.transform = 'scale(1)'; }, 150);
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================

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

// ========================================
// SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({ top: target.offsetTop - navbarHeight, behavior: 'smooth' });
    }
  });
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// ========================================
// NAVBAR SHADOW ON SCROLL
// ========================================

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none';
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopButton.classList.toggle('visible', window.scrollY > 500);
});
backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// SCROLL REVEAL — FIXED (replaces broken data-aos)
// Works reliably on GitHub Pages
// ========================================

function initScrollReveal() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything immediately
    elements.forEach(el => el.classList.add('visible'));
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

  elements.forEach(el => observer.observe(el));

  // Also trigger for elements already in view on page load
  setTimeout(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', initScrollReveal);
window.addEventListener('load', initScrollReveal);

// ========================================
// SKILLS PROGRESS ANIMATION
// ========================================

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
        const skillProgress = entry.target.querySelector('.skill-progress');
        const progress = skillProgress ? skillProgress.getAttribute('data-progress') : 0;
        entry.target.classList.add('visible');
        setTimeout(() => {
          if (skillProgress) skillProgress.style.width = progress + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  skillItems.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', animateSkills);
window.addEventListener('load', animateSkills);

// ========================================
// CONTACT FORM VALIDATION & SUBMISSION
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitButton = contactForm.querySelector('.btn-submit');
  const formMessage = document.getElementById('formMessage');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(input, errorElement, validationFn) {
    input.addEventListener('blur', () => {
      const error = validationFn(input.value);
      errorElement.textContent = error;
      input.style.borderColor = error ? '#ef4444' : 'var(--accent-primary)';
    });
    input.addEventListener('input', () => {
      if (errorElement.textContent) {
        const error = validationFn(input.value);
        errorElement.textContent = error;
        if (!error) input.style.borderColor = 'var(--accent-primary)';
      }
    });
  }

  const validateName = (v) => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : '';
  const validateEmail = (v) => !v.trim() ? 'Email is required' : !emailPattern.test(v) ? 'Please enter a valid email' : '';
  const validateMessage = (v) => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'Message must be at least 10 characters' : '';

  validateField(nameInput, document.getElementById('nameError'), validateName);
  validateField(emailInput, document.getElementById('emailError'), validateEmail);
  validateField(messageInput, document.getElementById('messageError'), validateMessage);

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameError = validateName(nameInput.value);
    const emailError = validateEmail(emailInput.value);
    const messageError = validateMessage(messageInput.value);

    document.getElementById('nameError').textContent = nameError;
    document.getElementById('emailError').textContent = emailError;
    document.getElementById('messageError').textContent = messageError;

    if (nameError || emailError || messageError) {
      if (nameError) nameInput.style.borderColor = '#ef4444';
      if (emailError) emailInput.style.borderColor = '#ef4444';
      if (messageError) messageInput.style.borderColor = '#ef4444';
      return;
    }

    submitButton.classList.add('loading');
    submitButton.disabled = true;
    formMessage.style.display = 'none';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      submitButton.classList.remove('loading');
      submitButton.disabled = false;

      if (response.ok) {
        formMessage.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        contactForm.reset();
        [nameInput, emailInput, messageInput].forEach(i => { i.style.borderColor = 'transparent'; });
        setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
      } else {
        formMessage.textContent = '✗ Something went wrong. Please try again or email me directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
      }
    } catch (error) {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      formMessage.textContent = '✗ Network error. Please check your connection.';
      formMessage.className = 'form-message error';
      formMessage.style.display = 'block';
    }
  });
}

// ========================================
// TYPING ANIMATION
// ========================================

if (typeof Typed !== 'undefined') {
  const typingElement = document.querySelector('.typing');
  if (typingElement) {
    new Typed('.typing', {
      strings: ['Freelance Developer', 'Website Designer', 'Frontend Specialist', 'Problem Solver'],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }
}

// ========================================
// COUNTER ANIMATION — NaN Bug Fixed
// ========================================

function animateCounter(element, target, duration = 2000) {
  if (isNaN(target)) return; // "Fast" aur other text stats skip
  const suffix = element.dataset.original.replace(/[0-9]/g, '');
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => { el.dataset.original = el.textContent.trim(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const original = entry.target.dataset.original;
        const value = parseInt(original.replace(/\D/g, ''), 10);
        animateCounter(entry.target, value);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);

// ========================================
// PERFORMANCE — DEBOUNCE
// ========================================

function debounce(func, wait = 10) {
  let timeout;
  return function (...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 50));

// ========================================
// LAZY LOADING IMAGES
// ========================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ========================================
// PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => { document.body.style.opacity = '1'; });

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c👨‍💻 Looking for a developer? ', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cLet\'s work together! 📧 ankitdevx.26@gmail.com', 'color: #fff; font-size: 14px; background: linear-gradient(135deg, #00d4ff, #0099ff); padding: 10px; border-radius: 5px;');

// ========================================
// EASTER EGG - KONAMI CODE
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-konamiSequence.length);
  if (konamiCode.join('') === konamiSequence.join('')) {
    document.body.style.animation = 'rainbow 2s linear infinite';
    const style = document.createElement('style');
    style.textContent = `@keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
    document.head.appendChild(style);
    setTimeout(() => { document.body.style.animation = ''; style.remove(); }, 5000);
  }
});

// ========================================
// UTILITY
// ========================================

// Update copyright year automatically
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Keyboard navigation
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
document.addEventListener('mousedown', () => { document.body.classList.remove('keyboard-nav'); });

window.addEventListener('beforeprint', () => { document.body.classList.add('printing'); });
window.addEventListener('afterprint', () => { document.body.classList.remove('printing'); });
