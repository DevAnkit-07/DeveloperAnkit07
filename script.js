// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Add animation feedback
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 150);
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

// Close mobile menu when clicking nav links
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
      const targetPosition = target.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
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
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// ========================================
// NAVBAR BACKGROUND ON SCROLL
// ========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ========================================
// SCROLL REVEAL ANIMATION (AOS)
// ========================================

function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');

  // If IntersectionObserver not supported, just show everything
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.05,          // trigger when just 5% visible
    rootMargin: '0px 0px 0px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Also check immediately for elements already in view on load
  setTimeout(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('aos-animate');
      }
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
  }, {
    threshold: 0.1
  });

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
  
  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Real-time validation
  function validateField(input, errorElement, validationFn) {
    input.addEventListener('blur', () => {
      const error = validationFn(input.value);
      errorElement.textContent = error;
      
      if (error) {
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = 'var(--accent-primary)';
      }
    });
    
    input.addEventListener('input', () => {
      if (errorElement.textContent) {
        const error = validationFn(input.value);
        errorElement.textContent = error;
        
        if (!error) {
          input.style.borderColor = 'var(--accent-primary)';
        }
      }
    });
  }
  
  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };
  
  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    if (!emailPattern.test(value)) return 'Please enter a valid email';
    return '';
  };
  
  const validateMessage = (value) => {
    if (!value.trim()) return 'Message is required';
    if (value.trim().length < 10) return 'Message must be at least 10 characters';
    return '';
  };
  
  // Apply validation
  validateField(nameInput, document.getElementById('nameError'), validateName);
  validateField(emailInput, document.getElementById('emailError'), validateEmail);
  validateField(messageInput, document.getElementById('messageError'), validateMessage);
  
  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(nameInput.value);
    const emailError = validateEmail(emailInput.value);
    const messageError = validateMessage(messageInput.value);
    
    document.getElementById('nameError').textContent = nameError;
    document.getElementById('emailError').textContent = emailError;
    document.getElementById('messageError').textContent = messageError;
    
    // If there are errors, don't submit
    if (nameError || emailError || messageError) {
      if (nameError) nameInput.style.borderColor = '#ef4444';
      if (emailError) emailInput.style.borderColor = '#ef4444';
      if (messageError) messageInput.style.borderColor = '#ef4444';
      return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    formMessage.style.display = 'none';
    
    try {
      // Submit form to Formspree
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Reset loading state
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      
      if (response.ok) {
        // Success
        formMessage.textContent = '✓ Message sent successfully! I\'ll get back to you within 24 hours.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Reset input styles
        [nameInput, emailInput, messageInput].forEach(input => {
          input.style.borderColor = 'transparent';
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      } else {
        // Error
        formMessage.textContent = '✗ Oops! Something went wrong. Please try again or email me directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
      }
    } catch (error) {
      // Network error
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      
      formMessage.textContent = '✗ Network error. Please check your connection and try again.';
      formMessage.className = 'form-message error';
      formMessage.style.display = 'block';
    }
  });
}

// ========================================
// TYPING ANIMATION (HERO)
// ========================================

// Check if Typed.js is loaded
if (typeof Typed !== 'undefined') {
  const typingElement = document.querySelector('.typing');
  
  if (typingElement) {
    new Typed('.typing', {
      strings: [
        'Freelance Developer',
        'Website Designer', 
        'Frontend Specialist',
        'Problem Solver'
      ],
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
// COUNTER ANIMATION (STATS)
// ========================================

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
    }
  }, 16);
}

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const text = entry.target.textContent;
        const value = parseInt(text.replace(/\D/g, ''));
        animateCounter(entry.target, value);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(number => observer.observe(number));
}

document.addEventListener('DOMContentLoaded', initCounters);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handlers
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
// PREVENT FOUC (Flash of Unstyled Content)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
  '%c👨‍💻 Looking for a developer? ',
  'color: #00d4ff; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
);
console.log(
  '%cLet\'s work together! 📧 ankitdevx.26@gmail.com',
  'color: #fff; font-size: 14px; background: linear-gradient(135deg, #00d4ff, #0099ff); padding: 10px; border-radius: 5px;'
);

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
  // Remove any loading screens if present
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
  
  // Trigger initial animations
  document.body.classList.add('loaded');
});

// ========================================
// EASTER EGG - KONAMI CODE
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-konamiSequence.length);
  
  if (konamiCode.join('') === konamiSequence.join('')) {
    // Easter egg activated!
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.body.style.animation = '';
      style.remove();
    }, 5000);
  }
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get current year for copyright
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.footer-copyright');
if (copyrightElement && copyrightElement.textContent.includes('2025')) {
  copyrightElement.textContent = copyrightElement.textContent.replace('2025', currentYear);
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Skip to main content with 'S' key
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault();
    const mainContent = document.querySelector('main') || document.querySelector('#home');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Add focus visible for better keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ========================================
// PRINT STYLES OPTIMIZATION
// ========================================

window.addEventListener('beforeprint', () => {
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});
