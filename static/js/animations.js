/* animations.js — stanleyluuuu.github.io */
(function () {
  'use strict';

  /* ─────────────────────────────────────────
     ALWAYS-ON (independent of reduced motion)
  ───────────────────────────────────────── */

  /* Developer console easter egg */
  if (window.console && console.log) {
    console.log('%c  Hi there!  ', 'background:#2563EB;color:#F5F4FF;font-size:16px;font-weight:700;padding:6px 16px;border-radius:4px;');
    console.log('%c Kuan-Wei Lu — AI Software Engineer @ Garmin', 'color:#2563EB;font-size:13px;font-weight:600;');
    console.log('%c stanley860920@gmail.com  ·  github.com/Stanleyluuuu', 'color:#6B7280;font-size:11px;');
    console.log('%c Like what you see? Let\'s connect.', 'color:#6B7280;font-style:italic;font-size:11px;');
  }

  /* Copy email to clipboard when clicking the contact button */
  function showToast(msg) {
    var t = document.getElementById('copy-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'copy-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  var emailBtn = document.querySelector('#contact a[href^="mailto:"]');
  if (emailBtn && navigator.clipboard) {
    emailBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('stanley860920@gmail.com').then(function () {
        showToast('✓  Email copied to clipboard');
      }).catch(function () { /* fall through to mailto */ });
    });
  }

  /* ─────────────────────────────────────────
     MOTION — bail if user prefers no motion
  ───────────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Scroll progress bar ── */
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', function () {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });

  /* ── Hero entrance: h1 → h2 → p → buttons staggered ── */
  [
    { sel: '#hero h1',                   delay: 200, dy: 12 },
    { sel: '#hero h2',                   delay: 380, dy: 8  },
    { sel: '#hero p',                    delay: 520, dy: 8  },
    { sel: '#hero .mt-4, #hero .mt-3',   delay: 650, dy: 6  },
  ].forEach(function (item) {
    var el = document.querySelector(item.sel);
    if (!el || el.style.opacity) return;
    el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.opacity   = '0';
    el.style.transform = 'translateY(' + item.dy + 'px)';
    setTimeout(function () {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, item.delay);
  });

  /* ── Scroll reveal helper ── */
  function makeRevealObserver(options) {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('did-reveal');
          obs.unobserve(entry.target);
        }
      });
    }, options);
  }

  /* ── Skill pill stagger when About scrolls in ── */
  var skillList = document.querySelector('#about ul');
  if (skillList) {
    skillList.querySelectorAll('li').forEach(function (pill) {
      pill.classList.add('will-reveal');
    });
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('li').forEach(function (pill, i) {
          pill.style.setProperty('--stagger', i);
          setTimeout(function () { pill.classList.add('did-reveal'); }, i * 45);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 }).observe(skillList);
  }

  /* Stagger cards within their row, then observe */
  var cardObs = makeRevealObserver({ threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('#projects .row, #education .row').forEach(function (row) {
    row.querySelectorAll('.project-card-noimg, .card').forEach(function (card, i) {
      card.classList.add('will-reveal');
      card.style.setProperty('--stagger', i);
      cardObs.observe(card);
    });
  });

  /* Section-level reveals */
  var secObs = makeRevealObserver({ threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('#experience .experience-container, #contact .container').forEach(function (el) {
    el.classList.add('will-reveal');
    secObs.observe(el);
  });

  /* ── Button ripple ── */
  document.querySelectorAll('#hero a.btn:not(.social-icon), #contact .btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var r = document.createElement('span');
      r.className = 'btn-ripple';
      var rect = btn.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top  = (e.clientY - rect.top) + 'px';
      btn.appendChild(r);
      setTimeout(function () { r.remove(); }, 600);
    });
  });

})();
