/**
 * Amandaria — Vanya Nadi
 * Plain, dependency-free JavaScript. One IIFE, organized by concern:
 *   1. Header scroll state
 *   2. Mobile menu
 *   3. Scroll-reveal
 *   4. Generative topographic canvas art
 *   5. Inquiry form
 *
 * No framework, no build step — this file is served as-is.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. Header scroll state                                              */
  /* ------------------------------------------------------------------ */

  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var threshold = 24;

    function update() {
      if (window.scrollY > threshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Mobile menu                                                       */
  /* ------------------------------------------------------------------ */

  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll('a');

    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    });

    links.forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    // Keep the menu usable if the viewport crosses back over the
    // desktop breakpoint while it's open.
    window.addEventListener(
      'resize',
      function () {
        if (window.innerWidth > 1280 && menu.classList.contains('is-open')) {
          close();
        }
      },
      { passive: true },
    );
  }

  /* ------------------------------------------------------------------ */
  /* 3. Scroll-reveal                                                     */
  /* ------------------------------------------------------------------ */

  function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Generative topographic canvas art                                 */
  /*    Used only when a .topo-field still contains a <canvas>. Photo    */
  /*    fields skip this and rely on the image + grain overlay instead.  */
  /* ------------------------------------------------------------------ */

  function makeSeededRandom(seedString) {
    var seed = 0;
    for (var i = 0; i < seedString.length; i += 1) {
      seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
    }
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function paintTopoField(field) {
    var canvas = field.querySelector('canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var seedName = field.getAttribute('data-topo') || 'field';
    var rand = makeSeededRandom(seedName);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = field.clientWidth;
    var height = field.clientHeight;

    if (width === 0 || height === 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Base tone.
    ctx.fillStyle = '#0d2434';
    ctx.fillRect(0, 0, width, height);

    // Soft mist glow, positioned per-field from the seed.
    var glowX = width * (0.25 + rand() * 0.5);
    var glowY = height * (0.15 + rand() * 0.3);
    var glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.65);
    glow.addColorStop(0, 'rgba(217, 194, 124, 0.16)');
    glow.addColorStop(0.5, 'rgba(211, 217, 219, 0.05)');
    glow.addColorStop(1, 'rgba(10, 28, 40, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Layered contour lines, each a gently undulating horizontal band.
    var lineCount = 13;
    for (var i = 0; i < lineCount; i += 1) {
      var baseY = (height / lineCount) * i + rand() * 18 - 9;
      var amplitude = 14 + rand() * 34;
      var frequency = 0.004 + rand() * 0.006;
      var phase = rand() * Math.PI * 2;
      var opacity = 0.05 + (i / lineCount) * 0.12;

      ctx.beginPath();
      for (var x = 0; x <= width; x += 6) {
        var y =
          baseY +
          Math.sin(x * frequency + phase) * amplitude +
          Math.sin(x * frequency * 2.3 + phase * 1.7) * amplitude * 0.3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = 'rgba(211, 217, 219, ' + opacity.toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // A single wandering river line, brighter and thinner.
    var riverAmplitude = width * (0.12 + rand() * 0.08);
    var riverFrequency = 0.003 + rand() * 0.002;
    var riverPhase = rand() * Math.PI * 2;
    var riverCenter = width * (0.3 + rand() * 0.4);

    ctx.beginPath();
    for (var y2 = 0; y2 <= height; y2 += 6) {
      var x2 = riverCenter + Math.sin(y2 * riverFrequency + riverPhase) * riverAmplitude;
      if (y2 === 0) {
        ctx.moveTo(x2, y2);
      } else {
        ctx.lineTo(x2, y2);
      }
    }
    ctx.strokeStyle = 'rgba(217, 194, 124, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // A few elevation-style number labels, quiet and small.
    var labelCount = 2 + Math.floor(rand() * 2);
    ctx.font = '10px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(211, 217, 219, 0.24)';
    for (var l = 0; l < labelCount; l += 1) {
      var lx = width * (0.08 + rand() * 0.8);
      var ly = height * (0.15 + rand() * 0.7);
      ctx.fillText(String(320 + Math.floor(rand() * 900)) + 'm', lx, ly);
    }
  }

  function initTopoFields() {
    var fields = document.querySelectorAll('.topo-field');
    if (!fields.length) return;

    function paintAll() {
      fields.forEach(paintTopoField);
    }

    paintAll();

    var resizeTimer = null;
    window.addEventListener(
      'resize',
      function () {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(paintAll, 180);
      },
      { passive: true },
    );
  }

  /* ------------------------------------------------------------------ */
  /* 5. Inquiry form                                                      */
  /* ------------------------------------------------------------------ */

  function initInquiryForm() {
    var panel = document.getElementById('inquiryPanel');
    var form = document.getElementById('inquiryForm');
    if (!panel || !form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }

      // No backend is wired up in this starter — the form simply
      // confirms receipt in place. Replace with a real submission
      // (fetch to an API route) when one exists.
      panel.classList.add('is-success');

      var heading = panel.querySelector('.inquiry-form__success-heading');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                  */
  /* ------------------------------------------------------------------ */

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initTopoFields();
    initInquiryForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
