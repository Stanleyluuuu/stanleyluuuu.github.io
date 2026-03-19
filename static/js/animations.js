/* animations.js — stanleyluuuu.github.io */
(function () {
  'use strict';

  /* ─────────────────────────────────────────
     ALWAYS-ON (independent of reduced motion)
  ───────────────────────────────────────── */

  /* Developer console easter egg */
  if (window.console && console.log) {
    console.log('%c  Hi there!  ', 'background:#4338CA;color:#F5F4FF;font-size:16px;font-weight:700;padding:6px 16px;border-radius:4px;');
    console.log('%c Kuan-Wei Lu — AI Software Engineer @ Garmin', 'color:#4338CA;font-size:13px;font-weight:600;');
    console.log('%c stanley860920@gmail.com  ·  github.com/Stanleyluuuu', 'color:#6B7280;font-size:11px;');
    console.log('%c Like what you see? Let\'s connect.', 'color:#6B7280;font-style:italic;font-size:11px;');
  }

  /* Copy email to clipboard when clicking the contact button */
  function showToast(msg) {
    var t = document.getElementById('copy-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'copy-toast';
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

  /* ── Hero h1 title fade-in (no typewriter since subtitle removed) ── */
  var h1 = document.querySelector('#hero h1');
  if (h1 && !h1.style.opacity) {
    h1.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    h1.style.opacity = '0';
    h1.style.transform = 'translateY(12px)';
    setTimeout(function () {
      h1.style.opacity = '1';
      h1.style.transform = 'translateY(0)';
    }, 200);
  }

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
