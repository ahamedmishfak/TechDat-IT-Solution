/* TechDat IT Solutions — app.js  (shared across every page) */
(function () {
  'use strict';

  var WHATSAPP = '94789779914';   // single source of truth for the number
  var d = document;

  /* ── Sticky app bar shadow ─────────────────────────────── */
  var appbar = d.querySelector('.appbar');
  if (appbar) {
    var onScroll = function () {
      appbar.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile drawer ─────────────────────────────────────── */
  var menuBtn = d.getElementById('menuBtn');
  var drawer = d.getElementById('drawer');
  if (menuBtn && drawer) {
    var setDrawer = function (open) {
      drawer.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      d.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setDrawer(false);
        menuBtn.focus();
      }
    });
  }

  /* ── "Shop now" dropdown ───────────────────────────────── */
  var shopTrigger = d.getElementById('shopTrigger');
  var shopMenu = d.getElementById('shopMenu');
  if (shopTrigger && shopMenu) {
    var wrap = shopTrigger.parentElement;

    var setShop = function (open) {
      shopMenu.classList.toggle('is-open', open);
      shopTrigger.setAttribute('aria-expanded', String(open));
    };

    shopTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setShop(shopTrigger.getAttribute('aria-expanded') !== 'true');
    });

    d.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) setShop(false);
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && shopMenu.classList.contains('is-open')) {
        setShop(false);
        shopTrigger.focus();
      }
    });
  }

  /* ── Reveal on scroll ──────────────────────────────────── */
  var reveals = d.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── Product filters ───────────────────────────────────── */
  var filterBar = d.querySelector('[data-filters]');
  if (filterBar) {
    var grid = d.querySelector('[data-products]');
    var empty = d.querySelector('[data-empty]');
    filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !grid) return;

      filterBar.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('is-on', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });

      var want = chip.dataset.filter;
      var shown = 0;
      grid.querySelectorAll('[data-cat]').forEach(function (card) {
        var match = want === 'all' || card.dataset.cat.split(' ').indexOf(want) > -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ── Enquire buttons → WhatsApp with the product name ──── */
  d.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-enquire]');
    if (!btn) return;
    e.preventDefault();
    var item = btn.dataset.enquire;
    var msg = 'Hello TechDat, I would like to enquire about: ' + item;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* ── Contact form ──────────────────────────────────────── */
  var form = d.getElementById('contactForm');
  if (form) {
    var ok = d.getElementById('formOk');
    var err = d.getElementById('formErr');
    var submit = form.querySelector('[type="submit"]');

    var showError = function (input, on) {
      var box = d.getElementById(input.id + 'Error');
      input.setAttribute('aria-invalid', String(on));
      if (box) box.classList.toggle('is-shown', on);
      return !on;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = d.getElementById('name');
      var email = d.getElementById('email');
      var message = d.getElementById('message');

      var valid = true;
      valid = showError(name, name.value.trim().length < 2) && valid;
      valid = showError(email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) && valid;
      valid = showError(message, message.value.trim().length < 10) && valid;
      if (!valid) {
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }

      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Sending…';
      ok.classList.remove('is-shown');
      err.classList.remove('is-shown');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Request failed');
          form.reset();
          ok.classList.add('is-shown');
          ok.focus();
        })
        .catch(function () {
          err.classList.add('is-shown');
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  }

  /* ── Password visibility toggle ────────────────────────── */
  var pwToggle = d.getElementById('pwToggle');
  if (pwToggle) {
    pwToggle.addEventListener('click', function () {
      var input = d.getElementById('password');
      var hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      pwToggle.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
      pwToggle.setAttribute('aria-pressed', String(hidden));
    });
  }

  /* ── Install as an app (PWA) ───────────────────────────── */
  var installBtn = d.getElementById('installBtn');
  var deferred = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (installBtn) {
      installBtn.hidden = false;
      installBtn.textContent = 'Install the app';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferred) {
        installBtn.textContent = 'Use your browser menu → Add to Home screen';
        return;
      }
      deferred.prompt();
      deferred.userChoice.then(function () {
        deferred = null;
        installBtn.hidden = true;
      });
    });
  }

  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.hidden = true;
  });

  /* ── Service worker (offline support) ──────────────────── */
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is optional */ });
    });
  }

  /* ── Instant estimator ─────────────────────────────────── */
  var ESTIMATES = {
    network: {
      label: 'Network engineering',
      small: { range: 'LKR 110,000 – 180,000', note: 'Single office, up to ~15 endpoints — cabling, switch setup and Wi-Fi.' },
      medium: { range: 'LKR 180,000 – 350,000', note: 'Multi-floor site or 15–50 endpoints — VLANs, firewall and structured cabling.' },
      large: { range: 'LKR 350,000+', note: 'Multi-site or 50+ endpoints — full design, CCTV and a documented handover.' }
    },
    support: {
      label: 'IT support',
      small: { range: 'LKR 6,000 – 12,000 / visit', note: 'Ad-hoc, pay-per-visit helpdesk and repairs.' },
      medium: { range: 'LKR 25,000 – 45,000 / month', note: 'Retainer for a small office — proactive monitoring and priority response.' },
      large: { range: 'LKR 60,000 – 120,000 / month', note: 'Retainer across multiple sites or 50+ users.' }
    },
    webdev: {
      label: 'Web development & design',
      small: { range: 'LKR 45,000 – 85,000', note: 'One-page site or landing page, mobile-ready and fast-loading.' },
      medium: { range: 'LKR 95,000 – 180,000', note: 'Multi-page business site with forms, on-page SEO and easy content updates.' },
      large: { range: 'LKR 200,000 – 450,000+', note: 'Online store, booking system or a custom web app style build.' }
    },
    hardware: {
      label: 'Hardware supply',
      small: { range: 'LKR 45,000 – 250,000', note: '1–5 units — warranty-backed, configured and delivered.' },
      medium: { range: 'LKR 250,000 – 1,200,000', note: '6–25 units, imaged to spec with delivery scheduling.' },
      large: { range: 'Custom bulk quote', note: '25+ units — send the spec sheet for preferential bulk pricing.' }
    }
  };
  var estService = d.getElementById('estService');
  var estScope = d.getElementById('estScope');
  var estRange = d.getElementById('estRange');
  var estNote = d.getElementById('estNote');
  var estWaBtn = d.getElementById('estWaBtn');
  if (estService && estScope && estRange && estNote) {
    var renderEstimate = function () {
      var svc = ESTIMATES[estService.value];
      var tier = svc[estScope.value];
      estRange.textContent = tier.range;
      estNote.textContent = tier.note;
      if (estWaBtn) {
        var scopeLabel = estScope.options[estScope.selectedIndex].text;
        var msg = 'Hi TechDat, I would like a quote for ' + svc.label + ' (' + scopeLabel +
          ' scope). The site estimate showed ' + tier.range + ' — could you confirm exact pricing for my requirement?';
        estWaBtn.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
      }
    };
    estService.addEventListener('change', renderEstimate);
    estScope.addEventListener('change', renderEstimate);
    renderEstimate();
  }

  /* ── Current year in footers ───────────────────────────── */
  d.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
