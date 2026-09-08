/* ==========================================================================
   FINTECH Payments — Global Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileDrawer();
  initNavbarScroll();
  initScrollProgress();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initTabs();
  initAccordion();
  initCarousel();
  initConverter();
  initTimeline();
  initSpendBars();
  initTilt();
  initFormValidation();
  initPasswordToggle();
});

/* --------------------------------------------------------------------------
   Theme
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const html = document.documentElement;
  const toggles = document.querySelectorAll('.theme-toggle');

  const saved = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = saved === 'dark' || (!saved && systemPrefersDark);

  applyTheme(startDark ? 'dark' : 'light');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    updateToggleIcons(theme);
  }
}

function updateToggleIcons(theme) {
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
  });
}

/* --------------------------------------------------------------------------
   Mobile drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.drawer-overlay');
  const menu = document.querySelector('.drawer-menu');
  const close = document.querySelector('.drawer-close');

  if (!hamburger || !overlay || !menu || !close) return;

  const open = () => {
    overlay.classList.add('active');
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const shut = () => {
    overlay.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', open);
  close.addEventListener('click', shut);
  overlay.addEventListener('click', shut);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('active')) shut();
  });
}

/* --------------------------------------------------------------------------
   Navbar state on scroll
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const update = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* --------------------------------------------------------------------------
   Reading progress bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* --------------------------------------------------------------------------
   Back to top
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const update = () => btn.classList.toggle('show', window.scrollY > 400);

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --------------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}

/* --------------------------------------------------------------------------
   Animated counters — <span data-count="1200000" data-suffix="+">
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const run = el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration || '1800', 10);
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = prefix + formatNumber(value, decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(run);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        run(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
}

function formatNumber(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/* --------------------------------------------------------------------------
   Tabs — [data-tabs] wrapper, .tab-btn[data-tab], .tab-panel[data-panel]
   -------------------------------------------------------------------------- */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.tab;
        buttons.forEach(b => {
          const on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', String(on));
        });
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Accordion
   -------------------------------------------------------------------------- */
function initAccordion() {
  document.querySelectorAll('.accordion').forEach(acc => {
    const items = acc.querySelectorAll('.acc-item');

    items.forEach(item => {
      const head = item.querySelector('.acc-head');
      const body = item.querySelector('.acc-body');
      if (!head || !body) return;

      const setOpen = open => {
        item.classList.toggle('open', open);
        head.setAttribute('aria-expanded', String(open));
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
      };

      if (item.classList.contains('open')) setOpen(true);

      head.addEventListener('click', () => {
        const willOpen = !item.classList.contains('open');
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const oh = other.querySelector('.acc-head');
            const ob = other.querySelector('.acc-body');
            if (oh) oh.setAttribute('aria-expanded', 'false');
            if (ob) ob.style.maxHeight = '0px';
          }
        });
        setOpen(willOpen);
      });
    });

    window.addEventListener('resize', () => {
      acc.querySelectorAll('.acc-item.open .acc-body').forEach(body => {
        body.style.maxHeight = body.scrollHeight + 'px';
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Testimonial carousel
   -------------------------------------------------------------------------- */
function initCarousel() {
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const track = root.querySelector('.carousel-track');
    const slides = root.querySelectorAll('.carousel-slide');
    const prev = root.querySelector('[data-car-prev]');
    const next = root.querySelector('[data-car-next]');
    const dotsWrap = root.querySelector('.car-dots');
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'car-dot' + (i === 0 ? ' active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', () => { go(i); restart(); });
        dotsWrap.appendChild(dot);
      });
    }

    const go = i => {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.car-dot').forEach((d, di) => {
          d.classList.toggle('active', di === index);
        });
      }
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 7000);
    };

    if (prev) prev.addEventListener('click', () => { go(index - 1); restart(); });
    if (next) next.addEventListener('click', () => { go(index + 1); restart(); });

    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);

    // Touch swipe
    let startX = 0;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) { go(delta < 0 ? index + 1 : index - 1); restart(); }
    }, { passive: true });

    restart();
  });
}

/* --------------------------------------------------------------------------
   Live transfer estimator (indicative rates — demo only)
   -------------------------------------------------------------------------- */
const FX_TO_USD = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  INR: 0.012,
  AED: 0.272,
  CAD: 0.73,
  AUD: 0.66,
  SGD: 0.74,
  JPY: 0.0064
};

const CURRENCY_META = {
  USD: { flag: '\u{1F1FA}\u{1F1F8}', symbol: '$' },
  EUR: { flag: '\u{1F1EA}\u{1F1FA}', symbol: '€' },
  GBP: { flag: '\u{1F1EC}\u{1F1E7}', symbol: '£' },
  INR: { flag: '\u{1F1EE}\u{1F1F3}', symbol: '₹' },
  AED: { flag: '\u{1F1E6}\u{1F1EA}', symbol: 'AED ' },
  CAD: { flag: '\u{1F1E8}\u{1F1E6}', symbol: 'C$' },
  AUD: { flag: '\u{1F1E6}\u{1F1FA}', symbol: 'A$' },
  SGD: { flag: '\u{1F1F8}\u{1F1EC}', symbol: 'S$' },
  JPY: { flag: '\u{1F1EF}\u{1F1F5}', symbol: '¥' }
};

function initConverter() {
  const root = document.querySelector('[data-converter]');
  if (!root) return;

  const amountEl = root.querySelector('#conv-amount');
  const outEl = root.querySelector('#conv-result');
  const fromEl = root.querySelector('#conv-from');
  const toEl = root.querySelector('#conv-to');
  const fromFlag = root.querySelector('[data-flag="from"]');
  const toFlag = root.querySelector('[data-flag="to"]');
  const rateEl = root.querySelector('[data-rate]');
  const feeEl = root.querySelector('[data-fee]');
  const totalEl = root.querySelector('[data-total]');
  const swap = root.querySelector('[data-swap]');
  if (!amountEl || !outEl || !fromEl || !toEl) return;

  const rateBetween = (from, to) => (FX_TO_USD[from] || 1) / (FX_TO_USD[to] || 1);

  const update = () => {
    const from = fromEl.value;
    const to = toEl.value;
    const amount = Math.max(parseFloat(amountEl.value) || 0, 0);
    const rate = rateBetween(from, to);
    const converted = amount * rate;

    const outDecimals = converted >= 1000 ? 0 : 2;
    outEl.value = formatNumber(converted, outDecimals);

    if (fromFlag) fromFlag.textContent = CURRENCY_META[from].flag;
    if (toFlag) toFlag.textContent = CURRENCY_META[to].flag;
    if (rateEl) rateEl.textContent = '1 ' + from + ' = ' + formatNumber(rate, rate < 1 ? 4 : 2) + ' ' + to;
    if (feeEl) feeEl.textContent = 'Free';
    if (totalEl) totalEl.textContent = CURRENCY_META[from].symbol + formatNumber(amount, 2) + ' ' + from;
  };

  amountEl.addEventListener('input', update);
  fromEl.addEventListener('change', update);
  toEl.addEventListener('change', update);

  if (swap) {
    swap.addEventListener('click', () => {
      const tmp = fromEl.value;
      fromEl.value = toEl.value;
      toEl.value = tmp;
      swap.classList.toggle('spin');
      update();
    });
  }

  update();
}

/* --------------------------------------------------------------------------
   Interactive timeline (About)
   -------------------------------------------------------------------------- */
function initTimeline() {
  const root = document.querySelector('[data-timeline]');
  if (!root) return;

  const buttons = root.querySelectorAll('.tl-btn');
  const panels = root.querySelectorAll('.tl-panel');
  const nav = root.querySelector('.timeline-nav');
  if (!buttons.length) return;

  const select = btn => {
    const key = btn.dataset.year;
    const index = Array.from(buttons).indexOf(btn);

    buttons.forEach(b => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    panels.forEach(p => p.classList.toggle('active', p.dataset.year === key));

    if (nav && buttons.length > 1) {
      const pct = (index / (buttons.length - 1)) * 88;
      nav.style.setProperty('--tl-progress', pct + '%');
    }
  };

  buttons.forEach(btn => btn.addEventListener('click', () => select(btn)));

  const initial = root.querySelector('.tl-btn.active') || buttons[0];
  select(initial);
}

/* --------------------------------------------------------------------------
   Spending bars — fill on scroll
   -------------------------------------------------------------------------- */
function initSpendBars() {
  const bars = document.querySelectorAll('.spend-fill[data-width]');
  if (!bars.length) return;

  const fill = el => { el.style.width = el.dataset.width + '%'; };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fill);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => fill(entry.target), (parseInt(entry.target.dataset.order || '0', 10)) * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(el => io.observe(el));
}

/* --------------------------------------------------------------------------
   Subtle pointer tilt on [data-tilt] elements
   -------------------------------------------------------------------------- */
function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(el => {
    const max = parseFloat(el.dataset.tilt) || 6;

    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform .4s cubic-bezier(0.16, 1, 0.3, 1)';

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .12s linear';
      el.style.transform =
        'perspective(1000px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' +
        (px * max).toFixed(2) + 'deg) translateY(-4px)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .55s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   Form validation
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        if (!validateInput(input)) isValid = false;
      });

      const password = form.querySelector('input[name="password"]');
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');

      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          showError(confirmPassword, 'Passwords do not match');
          isValid = false;
        } else if (confirmPassword.value) {
          showSuccess(confirmPassword);
        }
      }

      const terms = form.querySelector('input[name="terms"]');
      if (terms) {
        const group = terms.closest('.checkbox-group') || terms.closest('.form-group');
        if (!terms.checked) {
          isValid = false;
          if (group) {
            let msg = group.querySelector('.error-msg');
            if (!msg) {
              msg = document.createElement('span');
              msg.className = 'error-msg';
              group.appendChild(msg);
            }
            msg.textContent = 'You must agree to the terms.';
            msg.style.display = 'flex';
          }
        } else if (group) {
          const msg = group.querySelector('.error-msg');
          if (msg) msg.style.display = 'none';
        }
      }

      if (isValid) {
        const existing = form.querySelector('.form-success');
        if (existing) existing.remove();

        const successMsg = document.createElement('div');
        successMsg.className = 'trust-badge form-success mb-4';
        successMsg.innerHTML = '<i class="ph-fill ph-check-circle"></i> Success! Your details were submitted.';
        form.prepend(successMsg);

        form.reset();
        form.querySelectorAll('.form-control').forEach(input => {
          input.classList.remove('success', 'error');
        });
      }
    });

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = errorHost(input).querySelector(".error-msg");
        if (err) err.style.display = 'none';
      });
    });
  });
}

function validateInput(input) {
  const type = input.getAttribute('type');
  let valid = true;
  let message = 'This field is required';

  if (!input.value.trim()) {
    valid = false;
  } else if (type === 'email') {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(input.value)) {
      valid = false;
      message = 'Please enter a valid email address';
    }
  } else if (type === 'password') {
    if (input.value.length < 8) {
      valid = false;
      message = 'Password must be at least 8 characters';
    }
  } else if (type === 'number' || input.dataset.numeric) {
    if (isNaN(input.value) || Number(input.value) <= 0) {
      valid = false;
      message = 'Please enter a valid amount';
    }
  }

  if (!valid) showError(input, message);
  else showSuccess(input);

  return valid;
}

/* The message hangs off the field group, never off a .pw-field wrapper —
   growing that wrapper would shift the password reveal button off centre. */
function errorHost(input) {
  return input.closest(".form-group") || input.parentElement;
}

function showError(input, message) {
  input.classList.add("error");
  input.classList.remove("success");
  const host = errorHost(input);
  let err = host.querySelector(".error-msg");
  if (!err) {
    err = document.createElement("span");
    err.className = "error-msg";
    host.appendChild(err);
  }
  err.innerHTML = '<i class="ph ph-warning-circle"></i>' + message;
  err.style.display = 'flex';
}

function showSuccess(input) {
  input.classList.remove("error");
  input.classList.add("success");
  const err = errorHost(input).querySelector(".error-msg");
  if (err) err.style.display = 'none';
}

/* --------------------------------------------------------------------------
   Password reveal (auth pages)
   -------------------------------------------------------------------------- */
function initPasswordToggle() {
  document.querySelectorAll('[data-pw-toggle]').forEach(btn => {
    const input = document.getElementById(btn.getAttribute('data-pw-toggle'));
    const icon = btn.querySelector('i');
    if (!input) return;

    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      if (icon) icon.className = show ? 'ph ph-eye-slash' : 'ph ph-eye';
      input.focus({ preventScroll: true });
    });
  });
}
