/* ===========================
   VEXA Marketing Agency
   Main JavaScript
   =========================== */

// ---- LOADING SCREEN ----
function initLoader() {
  const loader = document.getElementById('vexa-loader');
  const site   = document.getElementById('vexa-site');
  if (!loader) return;

  const pctEl = document.getElementById('load-pct');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 3;
    if (p > 99) p = 99;
    if (pctEl) pctEl.textContent = Math.round(p) + '%';
  }, 80);

  setTimeout(() => {
    clearInterval(iv);
    if (pctEl) pctEl.textContent = '100%';
    setTimeout(() => {
      loader.style.transition = 'opacity .5s ease';
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        if (site) { site.style.display = 'block'; site.classList.add('fade-in'); }
      }, 500);
    }, 300);
  }, 3500);
}

// ---- MOBILE NAV ----
function initMobileNav() {
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
  });
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur    = 1800;
  const start  = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / dur, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const val      = target * eased;
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); observer.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ---- FILTER TABS ----
function initFilters() {
  document.querySelectorAll('.filter-group').forEach(group => {
    const btns  = group.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('[data-filter]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.value;
        items.forEach(item => {
          const cats = item.dataset.filter.split(',');
          item.style.display = (val === 'all' || cats.includes(val)) ? '' : 'none';
        });
      });
    });
  });
}

// ---- BOOKING FORM (multi-step) ----
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  let currentStep = 1;

  function showStep(n) {
    form.querySelectorAll('.form-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
    });
    form.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === n);
      dot.classList.toggle('done',   i + 1 < n);
    });
    form.querySelectorAll('.step-line').forEach((line, i) => {
      line.classList.toggle('done', i + 1 < n);
    });
    currentStep = n;
  }

  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.next)));
  });
  form.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.back)));
  });

  // Service toggle
  form.querySelectorAll('.svc-option').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('selected'));
  });

  // Budget select
  form.querySelectorAll('.budget-option').forEach(el => {
    el.addEventListener('click', () => {
      form.querySelectorAll('.budget-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  // Time slots
  let selectedSlot = null;
  form.querySelectorAll('.time-slot:not(.unavail)').forEach(el => {
    el.addEventListener('click', () => {
      form.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      selectedSlot = el.textContent;
    });
  });

  // Submit
  const submitBtn = document.getElementById('submit-booking');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!selectedSlot) { alert('Please select a time slot.'); return; }
      const name    = (document.getElementById('b-fname')?.value || '') + ' ' + (document.getElementById('b-lname')?.value || '');
      const email   = document.getElementById('b-email')?.value || '—';
      const company = document.getElementById('b-company')?.value || '—';
      const success = document.getElementById('booking-success');
      const details = document.getElementById('booking-details');
      if (details) details.innerHTML = `<strong>Name:</strong> ${name.trim()}<br><strong>Email:</strong> ${email}<br><strong>Company:</strong> ${company}<br><strong>Slot:</strong> ${selectedSlot}`;
      form.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
      if (success) success.style.display = 'flex';
    });
  }
}

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initFilters();
  initBookingForm();
});