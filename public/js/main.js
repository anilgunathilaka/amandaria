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
 *  10. Architecture intro reveal + split
 *  11. Aranya scroll theme + image travel
 *  12. Experience hour carousel + copy parallax
 *  13. Culinary Journey scroll theme
 *  14. Absolute Privacy hold-and-grow reveal
 *  15. Footer wordmark -> logo lockup (closing reveal)
 *  16. Final CTA: text runs at 200% speed over a static image
 *
 * No framework, no build step — this file is served as-is.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Shared scroll dispatcher                                             */
  /*   One passive scroll listener + one rAF for the whole page. Section  */
  /*   effects register a callback with onPageScroll(fn); it runs once    */
  /*   per frame while the page moves. (The hero runs its own tighter     */
  /*   loop — see section 6.)                                             */
  /* ------------------------------------------------------------------ */

  var scrollCallbacks = [];
  var scrollScheduled = false;

  function runScrollCallbacks() {
    scrollScheduled = false;
    for (var i = 0; i < scrollCallbacks.length; i += 1) {
      try {
        scrollCallbacks[i]();
      } catch (err) {
        // One effect failing must not stop the others.
        // eslint-disable-next-line no-console
        console.error('[main.js] scroll callback failed:', err);
      }
    }
  }

  function scheduleScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(runScrollCallbacks);
  }

  function onPageScroll(fn) {
    scrollCallbacks.push(fn);
  }

  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });

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
    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // The header sits over a "light" section whenever a .section--light
    // spans the header line (hero + footer excluded). Checked live on
    // scroll so photo-phase / mid-viewport toggles stay in sync.
    var headerH = 72;
    var footer = document.getElementById('footer');

    function measure() {
      headerH = header.offsetHeight || 72;
    }

    // --- guarded state -------------------------------------------------
    var lastScrolled = null;
    var lastOnLight = null;
    var lastOnFooter = null;
    var lastE = -1;

    function isLightSection(el) {
      // Hero and footer stay out of the light/dark header swap —
      // mid-page light surfaces only (ivory sections).
      if (!el || el.id === 'top' || el.id === 'footer') return false;
      return el.classList.contains('section--light');
    }

    function update() {
      var y = window.pageYOffset;
      var scrolled = y > threshold;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        header.classList.toggle('is-scrolled', scrolled);
        if (heroIcon) heroIcon.classList.toggle('is-docked', scrolled);
      }

      // Live check — sections toggle .section--light while scrolling
      // (Architecture photo phase, Aranya mid-viewport, etc.).
      var onLight = false;
      var lights = document.querySelectorAll('.section--light');
      for (var i = 0; i < lights.length; i += 1) {
        if (!isLightSection(lights[i])) continue;
        var r = lights[i].getBoundingClientRect();
        if (r.top < headerH && r.bottom > 2) {
          onLight = true;
          break;
        }
      }
      if (onLight !== lastOnLight) {
        lastOnLight = onLight;
        header.classList.toggle('is-on-light', onLight);
      }

      var onFooter = false;
      if (footer) {
        var fr = footer.getBoundingClientRect();
        onFooter = fr.top < headerH && fr.bottom > 2;
      }
      if (onFooter !== lastOnFooter) {
        lastOnFooter = onFooter;
        header.classList.toggle('is-on-footer', onFooter);
      }

      if (!heroText) return;

      var t = (y - fadeStart) / fadeRange;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var e = reduceMotion ? (t > 0 ? 1 : 0) : easeOut(t);
      if (Math.abs(e - lastE) < 0.002) return;
      lastE = e;

      heroText.style.opacity = (1 - e).toFixed(3);
      heroText.style.transform =
        'translate3d(0, ' +
        (-22 * e).toFixed(1) +
        'px, 0) scale(' +
        (1 - 0.1 * e).toFixed(3) +
        ')';
      heroText.style.filter =
        e > 0.02 ? 'blur(' + (5 * e).toFixed(2) + 'px)' : 'none';
      heroText.style.pointerEvents = e > 0.8 ? 'none' : '';
    }

    measure();
    update();
    onPageScroll(update);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
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
  /*    The frame is pinned by native CSS position:sticky (hero.css).     */
  /*    This only scrubs two compositor-cheap things: the side curtains   */
  /*    open (--hero-open) as the frame reaches the top, and the wordmark */
  /*    fades in over the pinned phase. The video does not move — no      */
  /*    parallax. Geometry is measured once (and on resize); the loop     */
  /*    reads only window.pageYOffset and writes only a custom property   */
  /*    and opacity/transform — no per-frame layout, no repaint.          */
  /* ------------------------------------------------------------------ */

  function initHeroExpand() {
    var track = document.querySelector('[data-hero-track]');
    var frame = document.querySelector('[data-hero-frame]');
    var video = document.querySelector('[data-hero-video]');
    var wordmark = frame && frame.querySelector('[data-hero-wordmark]');
    if (!track || !frame) return;

    if (video) {
      video.muted = true;
      video.playsInline = true;
      if (video.play) {
        var playAttempt = video.play();
        if (playAttempt && playAttempt.catch) playAttempt.catch(function () {});
      }
    }

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function clamp01(n) {
      return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    // --- geometry, measured once and on resize (the only layout reads) --
    var trackDocTop = 0;
    var trackH = 0;
    var frameH = 0;
    var viewH = 0;

    function measure() {
      var r = track.getBoundingClientRect();
      trackDocTop = r.top + window.pageYOffset;
      trackH = track.offsetHeight;
      frameH = frame.offsetHeight;
      viewH = window.innerHeight || frameH;
    }

    // --- guarded compositor writes --------------------------------------
    var lastOpen = -1;
    var lastWm = -1;

    function frameStep(y) {
      // trackTop / trackBottom relative to the viewport — same values the
      // old getBoundingClientRect() produced, without forcing layout.
      var trackTop = trackDocTop - y;
      var trackBottom = trackTop + trackH;

      // Curtains open (boxed -> full-bleed) as the frame nears the top.
      var open = 1 - clamp01(trackTop / (viewH * 0.4 || 1));
      if (Math.abs(open - lastOpen) >= 0.002) {
        lastOpen = open;
        frame.style.setProperty('--hero-open', open.toFixed(4));
      }

      // Pin progress 0 -> 1 across the pinned phase, then held at 1 once
      // the frame releases (no reset -> nothing snaps). The video itself
      // no longer moves — it's locked in the frame.
      var pinT;
      if (trackTop > 0) {
        pinT = 0;
      } else if (trackBottom > frameH) {
        pinT = clamp01(-trackTop / Math.max(trackH - frameH, 1));
      } else {
        pinT = 1;
      }

      if (wordmark) {
        var wIn = Math.min(1, pinT / 0.16);
        var wOut = clamp01((pinT - 0.68) / 0.28);
        var v = Math.max(0, wIn - wOut);
        var e = v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v);
        if (Math.abs(e - lastWm) >= 0.002) {
          lastWm = e;
          wordmark.style.opacity = e.toFixed(3);
          wordmark.style.transform = reduceMotion
            ? ''
            : 'translate3d(0,' + (24 * (1 - e)).toFixed(1) + 'px,0)';
        }
      }
    }

    // --- frame-current rAF loop, alive only while the page is moving ----
    // Reading scrollY at the top of the same frame it paints keeps the
    // curtains and wordmark exactly on the scroll position (no rAF-after-
    // scroll lag); it parks itself after a few still frames.
    var raf = null;
    var lastY = -1;
    var idle = 0;

    function tick() {
      var y = window.pageYOffset;
      if (y !== lastY) {
        lastY = y;
        idle = 0;
      } else {
        idle += 1;
      }
      frameStep(y);
      raf = idle < 4 ? window.requestAnimationFrame(tick) : null;
    }

    function kick() {
      if (raf == null) {
        idle = 0;
        raf = window.requestAnimationFrame(tick);
      }
    }

    function remeasure() {
      measure();
      frameStep(window.pageYOffset);
    }

    measure();
    frameStep(window.pageYOffset);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', remeasure);
    // Late layout shifts (webfont swap, images) move where the track
    // starts — re-measure when they settle.
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasure);
    }
    if (window.ResizeObserver) {
      var stage = document.querySelector('.hero__stage');
      if (stage) new window.ResizeObserver(remeasure).observe(stage);
    }
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

    function apply() {
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

    apply();
    onPageScroll(apply);
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

    function apply() {
      if (reduceMotion || window.innerWidth <= 960) {
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

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 10. Architecture scroll sequence                                     */
  /*     1. Centered intro scales down on white (approach)                */
  /*     2. Pin holds — intro slides left while cards enter (no white gap) */
  /*     3. Carousel through the four material studies                    */
  /*     4. White returns; statement + body copy animate in              */
  /* ------------------------------------------------------------------ */

  function initArchitecture() {
    var section = document.getElementById('architecture');
    if (!section) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function clamp01(n) {
      return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    if (reduceMotion) return;

    var stage = section.querySelector('[data-architecture-stage]');
    var pin = stage && stage.querySelector('.architecture__pin');
    var frame = section.querySelector('[data-architecture-intro-frame]');
    var caption = section.querySelector('[data-architecture-caption]');
    var tag = section.querySelector('[data-architecture-tag]');
    var copy = section.querySelector('[data-architecture-copy]');
    var slidesRoot = section.querySelector('[data-architecture-slides]');
    var slideCards = stage.querySelectorAll('.architecture__slide');
    var backdropImg = section.querySelector('[data-architecture-backdrop-img]');
    var sampleSlide = slideCards[0];
    if (!stage || !pin || !frame || !slideCards.length) return;

    var pinH = 0;
    var scrollSpan = 1;
    var cardW = 0;
    var cardStep = 0;
    var desktopMq = window.matchMedia('(min-width: 961px)');

    function measure() {
      if (!desktopMq.matches) return;
      var viewH = window.innerHeight || 1;
      pinH = pin.offsetHeight || viewH;
      scrollSpan = Math.max(stage.offsetHeight - pinH, 1);
      if (sampleSlide) {
        cardW = sampleSlide.offsetWidth;
        var track = stage.querySelector('[data-architecture-slides-track]');
        var gap = track
          ? parseFloat(window.getComputedStyle(track).columnGap ||
              window.getComputedStyle(track).gap) || 0
          : 0;
        cardStep = cardW + gap;
      }
    }

    measure();
    window.addEventListener(
      'resize',
      function () {
        measure();
        apply();
      },
      { passive: true },
    );

    function setActive(index) {
      if (index < 0 || index >= slideCards.length) return;

      var slide = slideCards[index];

      if (caption) {
        caption.textContent = slide.getAttribute('data-caption') || '';
      }
      if (tag) {
        tag.textContent = slide.getAttribute('data-tag') || '';
      }
      if (backdropImg) {
        backdropImg.setAttribute('src', slide.getAttribute('data-image') || '');
      }
    }

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function easeProgress(t) {
      return smoothstep(clamp01(t));
    }

    function apply() {
      if (!desktopMq.matches) return;

      var rect = stage.getBoundingClientRect();
      var viewH = window.innerHeight || pinH || 1;
      var viewW = window.innerWidth;
      var stageTop = rect.top;
      var stageBottom = rect.bottom;

      // Entry: scale intro while the stage rises into view.
      // Pin: scrub only while the sticky frame is actually holding —
      // same top/bottom gate the hero expand uses.
      var entryP = clamp01((viewH - stageTop) / viewH);
      var pinP = 0;

      if (stageTop <= 0 && stageBottom > pinH) {
        pinP = clamp01(-stageTop / scrollSpan);
      } else if (stageBottom <= pinH) {
        pinP = 1;
      }

      // Pinned beats: delay → transition → carousel → white wipe → copy → release.
      var DELAY_END = 0.05;
      var TRANS_END = 0.38;
      var CAROUSEL_START = 0.4;
      var CAROUSEL_END = 0.78;
      var COPY_END = 0.95;

      // Phase 1 — scale the centered intro while approaching the pin.
      var p1 = easeProgress(entryP);

      // Phase 2 — intro off-screen while cards enter (one transition).
      var pTransRaw =
        pinP < DELAY_END
          ? 0
          : clamp01((pinP - DELAY_END) / (TRANS_END - DELAY_END));
      var pTrans = easeProgress(pTransRaw);
      var textP = pTrans;
      var imageP = easeProgress((pTransRaw - 0.04) / 0.96);

      // Phase 3 — carousel through four material cards.
      var p4 =
        pinP < CAROUSEL_START
          ? 0
          : pinP >= CAROUSEL_END
            ? 1
            : easeProgress((pinP - CAROUSEL_START) / (CAROUSEL_END - CAROUSEL_START));

      // Phase 4 — white sheet + copy slide in together R→L.
      var pCopy =
        pinP < CAROUSEL_END
          ? 0
          : pinP >= COPY_END
            ? 1
            : easeProgress((pinP - CAROUSEL_END) / (COPY_END - CAROUSEL_END));

      var scale = 1.5 - p1 * 0.72;
      var introExit = viewW * 1.12;
      var introX = textP * -introExit;
      var introY = 0;
      var introOpacity = 1;
      var captionOpacity = 0;
      var whiteX = -imageP * viewW;
      var backdropX = (1 - imageP) * viewW;
      var slidesOpacity = 1;
      var copyOpacity = 0;
      var slideW = cardW || viewW * 0.42;
      var step = cardStep || slideW + 40;
      var centerX = (viewW - slideW) / 2;
      var slideX = centerX + (1 - imageP) * (viewW - centerX);
      var activeIndex = 0;

      function cardX(index) {
        return centerX - index * step;
      }

      if (pinP >= CAROUSEL_END) {
        whiteX = viewW * (1 - pCopy);
        slidesOpacity = 1 - easeProgress((pCopy - 0.88) / 0.12);
        copyOpacity = easeProgress(pCopy / 0.18);
        introOpacity = 0;
        captionOpacity = 1 - easeProgress(pCopy / 0.22);
        activeIndex = slideCards.length - 1;
        slideX = cardX(activeIndex);
        backdropX = 0;
      } else if (pinP >= CAROUSEL_START) {
        whiteX = -viewW;
        backdropX = 0;
        introOpacity = 0;
        activeIndex = Math.min(
          slideCards.length - 1,
          Math.floor(p4 * slideCards.length),
        );
        slideX = cardX(0) - p4 * (slideCards.length - 1) * step;
        captionOpacity = 1;
      } else if (imageP > 0) {
        introOpacity = 1 - easeProgress(imageP / 0.55);
        captionOpacity = easeProgress(imageP / 0.72);
      } else if (pinP >= TRANS_END) {
        introOpacity = 1 - easeProgress((pinP - TRANS_END) / 0.08);
      }

      section.style.setProperty('--architecture-intro-scale', scale.toFixed(3));
      section.style.setProperty('--architecture-intro-x', introX.toFixed(1) + 'px');
      section.style.setProperty('--architecture-intro-y', introY.toFixed(1) + 'px');
      section.style.setProperty(
        '--architecture-intro-opacity',
        introOpacity.toFixed(3),
      );
      section.style.setProperty('--architecture-slide-x', slideX.toFixed(1) + 'px');
      section.style.setProperty(
        '--architecture-caption-opacity',
        captionOpacity.toFixed(3),
      );
      section.style.setProperty('--architecture-white-x', whiteX.toFixed(1) + 'px');
      section.style.setProperty('--architecture-backdrop-x', backdropX.toFixed(1) + 'px');
      section.style.setProperty(
        '--architecture-copy-opacity',
        copyOpacity.toFixed(3),
      );
      section.style.setProperty(
        '--architecture-slides-opacity',
        slidesOpacity.toFixed(3),
      );

      if (slidesRoot) {
        slidesRoot.setAttribute(
          'aria-hidden',
          imageP <= 0 && pinP < CAROUSEL_END ? 'true' : 'false',
        );
      }

      if (copy) {
        copy.setAttribute('aria-hidden', copyOpacity > 0.08 ? 'false' : 'true');
      }

      pin.classList.toggle(
        'is-text-sliding',
        pinP >= DELAY_END && pinP < TRANS_END,
      );

      section.classList.toggle(
        'is-photo',
        imageP > 0.2 && pCopy < 0.12,
      );
      // White intro / copy = light chrome; photo carousel = dark chrome.
      section.classList.toggle(
        'section--light',
        !(imageP > 0.2 && pCopy < 0.12),
      );
      section.classList.toggle('is-copy-phase', copyOpacity > 0.02);

      if (imageP > 0 || pinP >= CAROUSEL_START) {
        setActive(activeIndex);
      }
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 11. Aranya: mid-viewport charcoal + fast image travel (no zoom),     */
  /*     feature tags swap the panel photograph on click                  */
  /* ------------------------------------------------------------------ */

  function initAranya() {
    var section = document.getElementById('aranya');
    if (!section) return;

    var media =
      section.querySelector('[data-aranya-media]') ||
      section.querySelector('[data-aranya-image]');
    var desktopPanel = section.querySelector('.aranya__desktop-panel');
    var image = (desktopPanel || media) && (desktopPanel || media).querySelector('.media-fill');
    var caption = (desktopPanel || media) && (desktopPanel || media).querySelector('[data-aranya-caption]');
    var tags = section.querySelectorAll('.feature-tags__item');
    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    var fadeTimer = 0;

    // Mobile slider elements
    var slider = section.querySelector('[data-aranya-slider]');
    var viewport = slider && slider.querySelector('[data-aranya-viewport]');
    var track = slider && slider.querySelector('.aranya__slider-track');
    var slides = slider && slider.querySelectorAll('.aranya-slide');
    var prevBtn = slider && slider.querySelector('[data-aranya-prev]');
    var nextBtn = slider && slider.querySelector('[data-aranya-next]');

    function getStep() {
      if (!slides || !slides.length || !track) return 0;
      var slide = slides[0];
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return slide.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      if (!viewport) return 0;
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    }

    function currentSlideIndex() {
      var s = getStep();
      if (s <= 0 || !viewport) return 0;
      var idx = Math.round(viewport.scrollLeft / s);
      if (idx < 0) return 0;
      if (idx > slides.length - 1) return slides.length - 1;
      return idx;
    }

    function goToSlide(index) {
      if (!viewport) return;
      var s = getStep();
      var targetLeft = index * s;
      var max = maxScroll();
      if (targetLeft > max) targetLeft = max;
      if (targetLeft < 0) targetLeft = 0;
      viewport.scrollTo({
        left: targetLeft,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }

    function syncControls() {
      if (!viewport || !slides || !slides.length) return;
      var idx = currentSlideIndex();
      var max = maxScroll();
      var atStart = viewport.scrollLeft <= 4;
      var atEnd = viewport.scrollLeft >= max - 4;
      // Mobile slides: [0]=default River Pavilion, then feature tags map 1:1 from 1+.
      var featureSlideOffset = slides.length > tags.length ? 1 : 0;
      var featureIdx = idx - featureSlideOffset;

      if (prevBtn) prevBtn.disabled = atStart;
      if (nextBtn) nextBtn.disabled = atEnd;

      for (var t = 0; t < tags.length; t += 1) {
        var on = t === featureIdx;
        tags[t].classList.toggle('is-active', on);
        tags[t].setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    }

    function showFeature(target, targetIdx) {
      if (!target) return;

      for (var i = 0; i < tags.length; i += 1) {
        var on = tags[i] === target;
        tags[i].classList.toggle('is-active', on);
        tags[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      }

      if (image) {
        var src = target.getAttribute('data-image');
        var nextAlt = target.getAttribute('data-alt') || '';
        var nextCaption = target.getAttribute('data-caption') || '';
        if (src && image.getAttribute('src') !== src) {
          function applySource() {
            image.setAttribute('src', src);
            image.setAttribute('alt', nextAlt);
            if (caption && nextCaption) caption.textContent = nextCaption;
            image.classList.remove('is-fading');
          }

          if (reduceMotion) {
            applySource();
          } else {
            image.classList.add('is-fading');
            window.clearTimeout(fadeTimer);
            fadeTimer = window.setTimeout(applySource, 180);
          }
        }
      }

      if (typeof targetIdx === 'number' && viewport && window.innerWidth <= 960) {
        var featureSlideOffset = slides && slides.length > tags.length ? 1 : 0;
        goToSlide(targetIdx + featureSlideOffset);
      }
    }

    for (var t = 0; t < tags.length; t += 1) {
      (function (idx) {
        var tag = tags[idx];
        var preloadSrc = tag.getAttribute('data-image');
        if (preloadSrc) {
          var preload = new Image();
          preload.src = preloadSrc;
        }
        tag.addEventListener('click', function () {
          showFeature(this, idx);
        });
      })(t);
    }

    if (slider && viewport) {
      viewport.addEventListener('scroll', syncControls, { passive: true });

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          var current = currentSlideIndex();
          goToSlide(Math.max(0, current - 1));
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          var current = currentSlideIndex();
          goToSlide(Math.min(slides.length - 1, current + 1));
        });
      }

      syncControls();
      window.addEventListener('resize', syncControls, { passive: true });
    }

    function apply() {
      var dark = section.getBoundingClientRect().top <= window.innerHeight / 2;
      section.classList.toggle('section--light', !dark);
      section.classList.toggle('section--alt', dark);

      if (!media) return;

      if (reduceMotion || window.innerWidth <= 960) {
        media.style.transform = '';
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
      // 200% of the Our Story image travel — translate only, no scale.
      var travel = Math.min(viewH * 1.44, 1120);

      media.style.transform =
        'translate3d(0,' + (fromCenter * travel).toFixed(2) + 'px,0)';
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 13. Culinary Journey: split-screen cinematic entrance + scroll theme  */
  /*     White until the section reaches mid-viewport, then back to its   */
  /*     original background. As the section opens, the photograph slides */
  /*     in from the left and settles with a gentle scale, then drifts    */
  /*     subtly (continuous parallax) for as long as it's in view. The    */
  /*     copy panel is static — text doesn't animate.                     */
  /* ------------------------------------------------------------------ */

  function initCulinaryTheme() {
    var section = document.getElementById('culinary');
    if (!section) return;

    var media = section.querySelector('[data-culinary-media]');
    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function clamp01(n) {
      return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function apply() {
      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight;

      var passedHalf = rect.top <= viewH / 2;
      section.classList.toggle('section--light', !passedHalf);

      if (!media) return;

      if (reduceMotion || window.innerWidth <= 960) {
        media.style.transform = '';
        media.style.opacity = '';
        return;
      }

      var span = viewH + rect.height;
      if (span <= 0) return;

      var progress = clamp01((viewH - rect.top) / span);
      var fromCenter = progress - 0.5;

      // Slides in from the left as the section opens (0 -> ~0.5), then
      // just drifts a little vertically while the section is in view.
      var mediaEnter = smoothstep(clamp01((progress - 0.08) / 0.42));
      var slide = Math.min(window.innerWidth * 0.1, 140);
      var driftY = fromCenter * Math.min(viewH * 0.1, 80);
      media.style.transform =
        'translate3d(' +
        (-slide * (1 - mediaEnter)).toFixed(2) +
        'px,' +
        driftY.toFixed(2) +
        'px,0) scale(' +
        (0.96 + 0.04 * mediaEnter).toFixed(3) +
        ')';
      media.style.opacity = (0.82 + 0.18 * mediaEnter).toFixed(3);
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 7. Philosophy card slider (+ autoplay)                                */
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

    /* -- autoplay ---------------------------------------------------- */
    /* Opt-in via data-sanctuary-autoplay (ms, or "off"); defaults to
       6000. Advances one card every interval and loops. Suppressed while
       the section is off-screen, while the pointer/focus is inside it,
       for a spell after any manual navigation or swipe, and entirely
       under prefers-reduced-motion. */
    var apAttr = (root.getAttribute('data-sanctuary-autoplay') || '')
      .trim()
      .toLowerCase();
    var apMs =
      apAttr === 'off' || apAttr === '0' || apAttr === 'false'
        ? 0
        : parseInt(apAttr, 10) || 1000;
    var apAllowed =
      apMs > 0 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      cards.length > 1;
    var apInView = false;
    var apHold = false;
    var apNudgedAt = 0;
    var apTimer = null;
    var apResumeAfter = Math.max(apMs * 2, 10000);

    function apCanRun() {
      return (
        apAllowed &&
        apInView &&
        !apHold &&
        Date.now() - apNudgedAt >= apResumeAfter &&
        maxScroll() > 2
      );
    }

    function apTick() {
      if (apCanRun()) {
        // Loop when the track can't scroll any further (the last "page"
        // shows more than one card, so currentIndex() tops out before
        // cards.length - 1 — key off scroll position, like sync()).
        var atEnd = viewport.scrollLeft >= maxScroll() - 2;
        goTo(atEnd ? 0 : currentIndex() + 1);
      }
      apTimer = window.setTimeout(apTick, apMs);
    }

    function apStart() {
      if (apAllowed && !apTimer) apTimer = window.setTimeout(apTick, apMs);
    }

    function apStop() {
      window.clearTimeout(apTimer);
      apTimer = null;
    }

    function apNudge() {
      apNudgedAt = Date.now();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        apNudge();
        go(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        apNudge();
        go(1);
      });
    }

    for (var i = 0; i < lines.length; i += 1) {
      lines[i].addEventListener('click', function () {
        apNudge();
        var to = parseInt(this.getAttribute('data-sanctuary-to') || '0', 10);
        goTo(to);
      });
    }

    viewport.addEventListener('scroll', sync, { passive: true });
    onPageScroll(onWindow);
    sync();
    syncTheme();

    if (apAllowed) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          function (entries) {
            apInView = entries[0].isIntersecting;
            if (apInView) apStart();
            else apStop();
          },
          { threshold: 0.4 },
        ).observe(root);
      } else {
        apInView = true;
        apStart();
      }
      root.addEventListener('mouseenter', function () {
        apHold = true;
      });
      root.addEventListener('mouseleave', function () {
        apHold = false;
      });
      root.addEventListener('focusin', function () {
        apHold = true;
      });
      root.addEventListener('focusout', function () {
        apHold = false;
      });
      viewport.addEventListener('pointerdown', apNudge);
      viewport.addEventListener('wheel', apNudge, { passive: true });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 12. Experience hour carousel                                          */
  /* ------------------------------------------------------------------ */

  function initExperienceSlider() {
    var root = document.querySelector('[data-experience-slider]');
    var viewport = root && root.querySelector('[data-experience-viewport]');
    var prev = root && root.querySelector('[data-experience-prev]');
    var next = root && root.querySelector('[data-experience-next]');
    if (!root || !viewport) return;

    var track = viewport.querySelector('.experience__track');
    var cards = viewport.querySelectorAll('.experience-card');
    if (!track || !cards.length) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    var timer = 0;
    var interval = 4500;

    function step() {
      var card = cards[0];
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    }

    function lastStart() {
      var size = step();
      if (size <= 0) return 0;
      return Math.round(maxScroll() / size);
    }

    function currentIndex() {
      var size = step();
      if (size <= 0) return 0;
      var index = Math.round(viewport.scrollLeft / size);
      var last = lastStart();
      if (index < 0) return 0;
      if (index > last) return last;
      return index;
    }

    function goTo(index) {
      var last = lastStart();
      if (index > last) index = 0;
      if (index < 0) index = last;
      var left = index * step();
      var max = maxScroll();
      if (left > max) left = max;
      if (left < 0) left = 0;
      viewport.scrollTo({
        left: left,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }

    function go(direction) {
      goTo(currentIndex() + direction);
    }

    function stop() {
      window.clearInterval(timer);
      timer = 0;
    }

    function play() {
      stop();
      if (reduceMotion || cards.length < 2) return;
      timer = window.setInterval(function () {
        go(1);
      }, interval);
    }

    function sync() {
      root.classList.toggle('is-static', maxScroll() <= 2);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        go(-1);
        play();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        go(1);
        play();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function (event) {
      if (!root.contains(event.relatedTarget)) play();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else play();
    });

    viewport.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    play();
  }

  /* ------------------------------------------------------------------ */
  /* 13. Experience copy: 200% scroll speed vs the photos                 */
  /* ------------------------------------------------------------------ */

  function initExperienceParallax() {
    var section = document.getElementById('experience');
    var copy = section && section.querySelector('[data-experience-copy]');
    if (!section || !copy) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function apply() {
      if (reduceMotion || window.innerWidth <= 960) {
        copy.style.transform = '';
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
      var fastTravel = rect.height;

      copy.style.transform =
        'translate3d(0,' + (-fromCenter * fastTravel).toFixed(2) + 'px,0)';
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 14. Absolute Privacy: hold-and-grow reveal                           */
  /*     .privacy-section__pin sticks for one viewport height (same hold  */
  /*     technique the hero video uses) and flex-centers the frame        */
  /*     inside it while .privacy-section__stage's extra height scrolls   */
  /*     past underneath. Scrolling through that extra height drives      */
  /*     scale 0.8→1 and opacity 0.8→1; once full size is reached the     */
  /*     frame just holds there until the stage runs out and it          */
  /*     releases to scroll away normally. Once held (the page appears   */
  /*     to "stop"), the tree watermark keeps growing on its own for the  */
  /*     length of that hold, reaching full bloom right as it releases.  */
  /* ------------------------------------------------------------------ */

  function initPrivacyReveal() {
    var stage = document.querySelector('[data-privacy-stage]');
    var frame = document.querySelector('[data-privacy-frame]');
    if (!stage || !frame) return;

    var mark = frame.querySelector('.privacy-section__mark');

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion || window.innerWidth <= 960) return;

    function clamp01(n) {
      return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function apply() {
      var rect = stage.getBoundingClientRect();
      var viewH = window.innerHeight;

      // .privacy-section__pin sits at the stage's own top with no
      // offset, so rect.top here doubles as the pin's natural
      // (unstuck) top. Progress runs across exactly that entrance —
      // 0 the instant the section's top touches the bottom of the
      // viewport, 1 once it's fully pinned (rect.top reaches 0 and
      // the 100vh pin fills the screen). Whatever stage height remains
      // beyond that is where the fully-grown frame holds before it
      // releases.
      var progress = clamp01((viewH - rect.top) / viewH);

      var scale = (0.8 + 0.2 * progress).toFixed(3);
      var opacity = (0.8 + 0.2 * progress).toFixed(3);

      frame.style.transform = 'scale(' + scale + ')';
      frame.style.opacity = opacity;

      if (mark) {
        // Once the frame is fully pinned (progress reaches 1, i.e. the
        // page appears to "stop"), keep growing just the watermark —
        // matches .privacy-section__pin's own height (100vh - 300px) so
        // the growth spans exactly the hold, finishing right as the
        // section releases.
        var pinH = Math.max(viewH - 300, 1);
        var holdSpan = Math.max(rect.height - pinH, 1);
        var hold = smoothstep(clamp01(-rect.top / holdSpan));

        mark.style.transform =
          'translate(-50%,-50%) scale(' + (1 + hold * 1.15).toFixed(3) + ')';
        mark.style.opacity = (0.132 + hold * 0.108).toFixed(3);
      }
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 15. Footer wordmark -> logo lockup (closing reveal)                   */
  /*     #journey is pinned behind the page (position:fixed); the footer  */
  /*     rides above it with a bottom-margin scroll runway that stops     */
  /*     --outro-gap short of the top. Across that runway this scrubs     */
  /*     --outro 0 -> 1 (footer.css crossfades the wordmark to gold,      */
  /*     scales it down, grows in the icon + Vanya Nadi) and pins the     */
  /*     lockup centred in that gap band, resolving into the brand logo   */
  /*     over the revealed banner.                                         */
  /* ------------------------------------------------------------------ */

  function initFooterOutro() {
    var footer = document.querySelector('.site-footer');
    var lock = footer && footer.querySelector('[data-footer-lockup]');
    if (!footer || !lock) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    // Nudge the banner video into playback (autoplay can be blocked
    // until a gesture; muted + inline is the reliable combination).
    var video = document.querySelector('.journey-statement__video');
    if (video && video.play) {
      video.muted = true;
      video.playsInline = true;
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () {});
    }

    var header = document.getElementById('siteHeader');
    var gap =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--outro-gap',
        ),
        10,
      ) || 200;
    var ty = 0;

    function apply() {
      var viewH = window.innerHeight;
      var rect = footer.getBoundingClientRect();

      // Progress runs while the footer's bottom edge travels from the
      // bottom of the viewport up to --outro-gap from the top, where it
      // settles — the length of its own bottom-margin runway, which is
      // viewport minus that gap (see pages/home.css).
      var runway = Math.max(viewH - gap, 1);
      var progress = (viewH - rect.bottom) / runway;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Hold the first slice at rest (the wordmark just scrolls up),
      // resolve into the logo across the middle, and let the finished
      // lockup settle before the page bottoms out.
      var t = (progress - 0.12) / 0.74;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      t = t * t * (3 - 2 * t);

      footer.style.setProperty('--outro', t.toFixed(4));

      // Shrink the whole lockup toward the logo size (kept here rather
      // than in footer.css so it isn't on the background-clip:text
      // element, which ghosts glyphs in Blink when transformed).
      var scale = 1 - 0.74 * t;

      // Pin the lockup just below the header's docked logo icon, so the
      // wordmark clears it with roughly the icon-to-wordmark gap of the
      // real logo (the line-box leading above the caps supplies it).
      // transform-origin is center-top, so scale leaves the top edge
      // put; getBoundingClientRect().top minus the translate we last
      // applied recovers the natural (unpinned) top.
      var pin = header ? header.offsetHeight : 72;
      var naturalTop = lock.getBoundingClientRect().top - ty;
      ty = naturalTop < pin ? pin - naturalTop : 0;

      lock.style.transform =
        'translateY(' + ty.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
    }

    apply();
    onPageScroll(apply);
  }

  /* ------------------------------------------------------------------ */
  /* 16. Final CTA: text runs at 200% speed, image stays put              */
  /*     Same fromCenter parallax math the copy panes use elsewhere       */
  /*     (destination, architecture), but the photograph behind it is     */
  /*     static — only .final-cta__content moves, at double the usual     */
  /*     travel distance.                                                 */
  /* ------------------------------------------------------------------ */

  function initFinalCta() {
    var section = document.getElementById('final-cta');
    var content = section && section.querySelector('[data-final-cta-content]');
    if (!section || !content) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function apply() {
      if (reduceMotion || window.innerWidth <= 960) {
        content.style.transform = '';
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
      // 200% of a normal copy-pane travel (compare brand/destination's
      // ~0.7 * viewH) — the text runs noticeably faster than the static
      // backdrop behind it.
      var travel = Math.min(viewH * 1.4, 1080);

      content.style.transform =
        'translate3d(0,' + (-fromCenter * travel).toFixed(2) + 'px,0)';
    }

    apply();
    onPageScroll(apply);
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
    safeInit('initArchitecture', initArchitecture);
    safeInit('initAranya', initAranya);
    safeInit('initCulinaryTheme', initCulinaryTheme);
    safeInit('initPrivacyReveal', initPrivacyReveal);
    safeInit('initExperienceSlider', initExperienceSlider);
    safeInit('initExperienceParallax', initExperienceParallax);
    safeInit('initSanctuarySlider', initSanctuarySlider);
    safeInit('initFooterOutro', initFooterOutro);
    safeInit('initFinalCta', initFinalCta);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
