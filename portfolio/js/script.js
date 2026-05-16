/* ============================================================
   PORTFOLIO JS — Vadla Venkata Sahitya
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE (light/dark) ─────────────────────────
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'light');
    }
  };

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // ── NAVIGATION: Active link ─────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  // ── NAVIGATION: Scroll shadow ───────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // ── HAMBURGER MENU ──────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── SCROLL REVEAL (IntersectionObserver) ───────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ── TYPING ANIMATION (hero subtitle) ───────────────────
  const typingEl = document.querySelector('.hero-role');
  if (typingEl) {
    const phrases = [
      'DevOps & Full Stack Developer',
      'CI/CD Pipeline Builder',
      'Cloud & Kubernetes Engineer',
      'Java & React Developer',
      'AI Integration Enthusiast',
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
      const phrase = phrases[phraseIdx];
      const speed = isDeleting ? 50 : 90;

      if (!isDeleting) {
        typingEl.textContent = phrase.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === phrase.length) {
          isDeleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typingEl.textContent = phrase.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 1000);
  }

  // ── ANIMATED COUNTER (stats) ────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 60);

          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(interval);
          }, 25);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ── CONTACT FORM VALIDATION ─────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const showError = (field, msg) => {
      const err = document.getElementById(field + 'Error');
      if (err) { err.textContent = msg; err.classList.add('show'); }
    };
    const clearError = (field) => {
      const err = document.getElementById(field + 'Error');
      if (err) err.classList.remove('show');
    };

    // Real-time clear on input
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => clearError(el.id));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');

      // Validate name
      if (!name.value.trim()) {
        showError('name', 'Please enter your name.'); valid = false;
      }

      // Validate email
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError('email', 'Please enter your email.'); valid = false;
      } else if (!emailRe.test(email.value.trim())) {
        showError('email', 'Please enter a valid email address.'); valid = false;
      }

      // Validate message
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters.'); valid = false;
      }

      if (valid) {
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate send
        setTimeout(() => {
          form.reset();
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          const successEl = document.getElementById('formSuccess');
          if (successEl) { successEl.classList.add('show'); }
          setTimeout(() => { if (successEl) successEl.classList.remove('show'); }, 4000);
        }, 1400);
      }
    });
  }

  // ── CURSOR GLOW EFFECT ──────────────────────────────────
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    pointer-events: none;
    z-index: 9999;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  // ── CARD TILT EFFECT (subtle) ───────────────────────────
  document.querySelectorAll('.project-card, .card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
