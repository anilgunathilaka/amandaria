/**
 * Amandaria — Vanya Nadi
 * Plain, dependency-free JavaScript. One IIFE, organized by concern:
 *   1. Header scroll state
 *   2. Mobile menu
 *   3. Scroll-reveal
 *   4. Generative topographic canvas art
 *   5. Inquiry form
 *   6. Hero boxed-to-full-bleed scroll
 *   7. Philosophy card slider
 *   8. Our Story right-image parallax
 *   9. Destination parallax
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
    var heroIcon = document.querySelector('[data-hero-logo-icon]');
    var heroText = document.querySelector('[data-hero-logo-text]');
    if (!header) return;

    var threshold = 40;
    var fadeStart = 8;
    var fadeRange = 180;
    var ticking = false;
    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update() {
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var scrolled = y > threshold;
      header.classList.toggle('is-scrolled', scrolled);
      if (heroIcon) {
        heroIcon.classList.toggle('is-docked', scrolled);
      }

      var headerH = header.offsetHeight || 72;
      var onLight = false;
      var lights = document.querySelectorAll('.section--light');
      for (var i = 0; i < lights.length; i += 1) {
        var lightRect = lights[i].getBoundingClientRect();
        if (lightRect.top < headerH && lightRect.bottom > 0) {
          onLight = true;
          break;
        }
      }
      header.classList.toggle('is-on-light', onLight);

      if (!heroText) return;

      var t = (y - fadeStart) / fadeRange;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var e = reduceMotion ? (t > 0 ? 1 : 0) : easeOut(t);

      heroText.style.opacity = (1 - e).toFixed(3);
      heroText.style.transform =
        'translate3d(0, ' +
        (-22 * e).toFixed(1) +
        'px, 0) scale(' +
        (1 - 0.1 * e).toFixed(3) +
        ')';
      heroText.style.filter = e > 0.02 ? 'blur(' + (5 * e).toFixed(2) + 'px)' : 'none';
      heroText.style.pointerEvents = e > 0.8 ? 'none' : '';
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Mobile menu                                                       */
  /* ------------------------------------------------------------------ */

  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll('a');
    var label = toggle.querySelector('.menu-toggle__label');
    var openLabel = toggle.getAttribute('data-open-label') || 'Menu';
    var closeLabel = toggle.getAttribute('data-close-label') || 'Close';

    function setLabel(text) {
      toggle.setAttribute('aria-label', text);
      if (label) label.textContent = text;
    }

    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      setLabel(closeLabel);
      document.body.style.overflow = 'hidden';
    }

    function close() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      setLabel(openLabel);
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

    window.addEventListener(
      'resize',
      function () {
        if (
          window.innerWidth > 1365 &&
          window.scrollY <= 20 &&
          menu.classList.contains('is-open')
        ) {
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
  /* 6. Hero boxed-to-full-bleed scroll                                    */
  /*    Side insets ease to 0 as the video travels up. Full-bleed when    */
  /*    the clip reaches the top of the page.                             */
  /* ------------------------------------------------------------------ */

  function initHeroExpand() {
    var track = document.querySelector('[data-hero-track]');
    var frame = document.querySelector('[data-hero-frame]');
    var video = document.querySelector('[data-hero-video]');
    if (!track || !frame) return;

    if (video) {
      video.muted = true;
      video.playsInline = true;
      if (video.play) {
        var playAttempt = video.play();
        if (playAttempt && playAttempt.catch) playAttempt.catch(function () {});
      }
    }

    var ticking = false;

    function setBox(position, top, bottom, viewH) {
      frame.style.position = position;
      frame.style.top = top;
      frame.style.bottom = bottom;
      frame.style.left = '0px';
      frame.style.right = '0px';
      frame.style.width = '100%';
      // Use the JS-measured viewport height, not CSS 100vh — on mobile the
      // two disagree (address-bar chrome), which desyncs this box from the
      // rect-based math below and breaks the pin/release handoff.
      frame.style.height = viewH + 'px';
      frame.style.minHeight = viewH + 'px';
    }

    function apply() {
      ticking = false;
      var rect = track.getBoundingClientRect();
      var viewH = window.innerHeight;
      var approach = 1 - Math.min(1, Math.max(0, rect.top / Math.max(viewH * 0.4, 1)));

      frame.style.setProperty('--hero-clip', (1 - approach).toFixed(4));

      if (rect.top > 1) {
        setBox('sticky', '0px', 'auto', viewH);
        frame.style.zIndex = '';
        if (video) video.style.transform = '';
        return;
      }

      if (rect.bottom <= viewH) {
        setBox('absolute', 'auto', '0px', viewH);
        frame.style.zIndex = '';
        if (video) video.style.transform = '';
        return;
      }

      setBox('fixed', '0px', 'auto', viewH);
      frame.style.zIndex = '1';
      if (video) {
        var hold = Math.max(rect.height - viewH, 1);
        var shift = Math.min(1, Math.max(0, -rect.top / hold));
        video.style.transform = 'translate3d(0,' + (-12 * shift).toFixed(2) + '%,0)';
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
  }

  /* ------------------------------------------------------------------ */
  /* 8. Our Story parallax                                                 */
  /*    Copy runs ahead of the page; the portrait lags. #brand clips      */
  /*    both so The Philosophy is never covered.                           */
  /* ------------------------------------------------------------------ */

  function initBrandParallax() {
    var section = document.getElementById('brand');
    var media = section && section.querySelector('[data-brand-parallax]');
    var copy = section && section.querySelector('[data-brand-copy]');
    if (!section || (!media && !copy)) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    var ticking = false;

    function apply() {
      ticking = false;

      if (reduceMotion || window.innerWidth <= 960) {
        if (media) media.style.transform = '';
        if (copy) copy.style.transform = '';
        return;
      }

      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight;
      var span = viewH + rect.height;
      if (span <= 0) return;

      var progress = (viewH - rect.top) / span;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      var fromCenter = progress - 0.5;
      var slowTravel = Math.min(viewH * 0.72, 560);
      var fastTravel = Math.min(viewH * 0.72, 560);

      if (media) {
        media.style.transform =
          'translate3d(0,' + (fromCenter * slowTravel).toFixed(2) + 'px,0)';
      }
      if (copy) {
        copy.style.transform =
          'translate3d(0,' + (-fromCenter * fastTravel).toFixed(2) + 'px,0)';
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 9. Destination parallax                                               */
  /*    Background lags; copy runs ahead. The section clips both.         */
  /* ------------------------------------------------------------------ */

  function initDestinationParallax() {
    var section = document.getElementById('destination');
    var bg = section && section.querySelector('[data-destination-bg] .media-fill');
    var copy = section && section.querySelector('[data-destination-copy]');
    var scrim = section && section.querySelector('[data-destination-scrim]');
    if (!section || (!bg && !copy && !scrim)) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    var ticking = false;

    function apply() {
      ticking = false;

      if (reduceMotion) {
        if (bg) bg.style.transform = '';
        if (copy) copy.style.transform = '';
        if (scrim) scrim.style.opacity = '';
        return;
      }

      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight;
      var span = viewH + rect.height;
      if (span <= 0) return;

      var progress = (viewH - rect.top) / span;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      var fromCenter = progress - 0.5;
      var slowTravel = Math.min(rect.height * 0.16, 110);
      var fastTravel = Math.min(viewH * 1.05, 780);

      if (bg) {
        bg.style.transform =
          'translate3d(0,' + (fromCenter * slowTravel).toFixed(2) + 'px,0)';
      }
      if (copy) {
        copy.style.transform =
          'translate3d(0,' + (-fromCenter * fastTravel).toFixed(2) + 'px,0)';
      }
      if (scrim) {
        var fade = 1 - Math.pow(progress, 1.45) * 0.7;
        scrim.style.opacity = fade.toFixed(3);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Philosophy card slider                                             */
  /* ------------------------------------------------------------------ */

  function initSanctuarySlider() {
    var root = document.querySelector('[data-sanctuary-slider]');
    var viewport = root && root.querySelector('[data-sanctuary-viewport]');
    var prev = root && root.querySelector('[data-sanctuary-prev]');
    var next = root && root.querySelector('[data-sanctuary-next]');
    if (!root || !viewport) return;

    var track = viewport.querySelector('.sanctuary-slider__track');
    var cards = viewport.querySelectorAll('.sanctuary-card');
    if (!track || !cards.length) return;

    var lines = root.querySelectorAll('[data-sanctuary-to]');

    function step() {
      var card = cards[0];
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    }

    function currentIndex() {
      var size = step();
      if (size <= 0) return 0;
      var index = Math.round(viewport.scrollLeft / size);
      if (index < 0) return 0;
      if (index > cards.length - 1) return cards.length - 1;
      return index;
    }

    function goTo(index) {
      var left = index * step();
      var max = maxScroll();
      if (left > max) left = max;
      if (left < 0) left = 0;
      viewport.scrollTo({
        left: left,
        behavior: 'smooth',
      });
    }

    function sync() {
      var max = maxScroll();
      var atStart = viewport.scrollLeft <= 2;
      var atEnd = viewport.scrollLeft >= max - 2;
      root.classList.toggle('is-static', max <= 2);
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;

      var active = currentIndex();
      for (var i = 0; i < lines.length; i += 1) {
        var on = i === active;
        lines[i].classList.toggle('is-active', on);
        if (on) {
          lines[i].setAttribute('aria-current', 'true');
        } else {
          lines[i].removeAttribute('aria-current');
        }
      }
    }

    function go(direction) {
      goTo(currentIndex() + direction);
    }

    function syncTheme() {
      var dark = root.getBoundingClientRect().top <= window.innerHeight / 2;
      root.classList.toggle('section--light', !dark);
      root.classList.toggle('section--alt', dark);
    }

    function onWindow() {
      sync();
      syncTheme();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        go(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        go(1);
      });
    }

    for (var i = 0; i < lines.length; i += 1) {
      lines[i].addEventListener('click', function () {
        var to = parseInt(this.getAttribute('data-sanctuary-to') || '0', 10);
        goTo(to);
      });
    }

    viewport.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('scroll', onWindow, { passive: true });
    window.addEventListener('resize', onWindow);
    sync();
    syncTheme();
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                  */
  /* ------------------------------------------------------------------ */

  function safeInit(name, fn) {
    try {
      fn();
    } catch (err) {
      // One section's failure (e.g. a missing element, a browser quirk)
      // must not stop the rest from wiring up — each section is
      // independent, so isolate them.
      // eslint-disable-next-line no-console
      console.error('[main.js] ' + name + ' failed to initialize:', err);
    }
  }

  function init() {
    safeInit('initHeaderScroll', initHeaderScroll);
    safeInit('initMobileMenu', initMobileMenu);
    safeInit('initScrollReveal', initScrollReveal);
    safeInit('initTopoFields', initTopoFields);
    safeInit('initInquiryForm', initInquiryForm);
    safeInit('initHeroExpand', initHeroExpand);
    safeInit('initBrandParallax', initBrandParallax);
    safeInit('initDestinationParallax', initDestinationParallax);
    safeInit('initSanctuarySlider', initSanctuarySlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
