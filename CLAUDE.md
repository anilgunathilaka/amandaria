# Amandaria — Vanya Nadi: frontend architecture

This document is the source of truth for how CSS (and templates) are
organized in this project. It is deliberately strict, because the whole
point is to keep a hand-written stylesheet legible as the site grows past
one homepage into a full multi-page property.

## Non-negotiables

- **No CSS framework.** No Tailwind, no Bootstrap, no utility-class
  generators.
- **No CSS-in-JS.** Styles live in `.css` files under `public/css`, never
  inline in templates or built at runtime in JavaScript.
- **No jQuery, no frontend framework** (React/Vue/etc). `public/js/*.js`
  is plain, dependency-free JavaScript using standard DOM APIs.
- **No build step for CSS/JS.** Files in `public/` are served as-is by
  Nest's static assets middleware. What you write is what ships.
- **Views render server-side** via NestJS controllers + Handlebars
  (`express-handlebars`). Templates receive structured data from
  `*.content.ts` files — copy does not live in `.hbs` files as prose
  scattered through markup beyond what's needed for structure.

## The four layers

Stylesheets are organized into four layers, loaded in this exact order
(see `views/partials/head-styles.hbs`, the single place that lists every
stylesheet `<link>`). Each layer may only depend on the one(s) before it.

```
public/css/
├── tokens/          1. design tokens (custom properties only)
├── base/             2. resets + bare element defaults
├── components/      3. one file per reusable UI component (BEM)
└── pages/            4. page-specific composition/overrides
```

### 1. `tokens/` — design tokens

Custom properties only. No selectors beyond `:root`. This is the single
place color, type, spacing, motion and breakpoint values are defined.

- `colors.css` — the palette, sampled from the brand mark
  (`#163E55` navy / `#D4C275` gold) plus every semantic alias
  (`--color-surface`, `--color-text`, `--color-accent`, …). Components
  reference the semantic aliases, never raw hex values, and never the
  raw palette names directly.
- `typography.css` — font stacks, the type scale (as `clamp()` custom
  properties), weights, letter-spacing steps.
- `spacing.css` — the spacing scale and the section vertical-rhythm
  values.
- `motion.css` — easing curves and duration steps.

**Rule:** if you find yourself typing a hex code, a `px` font-size, or a
raw `cubic-bezier()` inside `components/` or `pages/`, stop — it belongs
here as a token instead.

### 2. `base/`

- `reset.css` — a minimal, modern reset (box-sizing, margin/padding
  zeroing, media defaults). Nothing project-specific.
- `global.css` — bare-element defaults that apply site-wide: `body`
  typography and background, link defaults, selection color, focus-visible
  ring, the `.wrap` / `.bleed` layout primitives, the `.reveal` scroll
  animation primitive, the shared grain/topo canvas plumbing. Nothing
  here should be a "component" in the BEM sense — it has no class of its
  own beyond generic, cross-cutting primitives.

### 3. `components/`

One file per component, named after the component: `button.css`,
`nav.css`, `hero.css`, `section-intro.css`, `art-panel.css`,
`sanctuary-list.css`, `material-row.css`, `feature-tags.css`,
`timeline.css`, `culinary-themes.css`, `privacy-section.css`,
`final-cta.css`, `inquiry-form.css`, `footer.css`, `mobile-menu.css`.

A component file contains **only** the selectors for that component's
block and its elements/modifiers (see naming below). It must not reach
into another component's classes. If two components need to share a
rule, that rule is either a token, a `base/global.css` primitive, or —
if it's genuinely a variant — a modifier on a shared component.

Every new reusable piece of UI gets its own file here, added to
`head-styles.hbs`. That's the whole scaling story: the list grows, the
cascade order (tokens → base → components → pages) never changes.

### 4. `pages/`

Page-specific layout glue that isn't reusable — e.g. `home.css` holds
the handful of one-off spacing tweaks for how components are arranged
on the homepage specifically. When a second page ships (e.g. a room
detail page), it gets its own `pages/room.css`, linked only from that
page's own `<head>` block, not from the shared layout.

## Naming convention: BEM

`block`, `block__element`, `block--modifier`, `block__element--modifier`.

```css
.hero { }
.hero__eyebrow { }
.hero__title { }
.hero__cta-group { }
.btn { }
.btn--primary { }
.btn--ghost { }
```

- A **block** is a component root (`.hero`, `.btn`, `.timeline`).
- An **element** (`__`) is a part of that block that only makes sense
  inside it (`.hero__title`).
- A **modifier** (`--`) is a variant of a block or element
  (`.btn--primary`, `.timeline__item--active`).
- Utility/primitive classes that intentionally cross component
  boundaries (`.wrap`, `.reveal`, `.eyebrow`, `.label-sm`) live in
  `base/global.css` and are the *only* exception to "one file per
  component" — they are primitives, not components.
- **State classes use `is-*`** (`.is-open`, `.is-visible`, `.is-scrolled`),
  toggled by JavaScript, and are styled alongside the block they modify
  (e.g. `.mobile-menu.is-open` lives in `mobile-menu.css`). They are not
  BEM modifiers because they describe transient JS-driven state, not a
  static design variant.

## Templates

```
views/
├── layouts/main.hbs        the single HTML shell (head, header, footer, scripts)
├── partials/                one partial per section/component
│   ├── head-styles.hbs      ordered <link> list — the CSS cascade, made explicit
│   ├── nav.hbs, mobile-menu.hbs, hero.hbs, brand-intro.hbs, …
│   └── footer.hbs
└── pages/home.hbs           composes the partials for the "/" route
```

- Each `.hbs` partial corresponds 1:1 with a CSS component file of the
  same concern (`hero.hbs` ↔ `hero.css`, `footer.hbs` ↔ `footer.css`).
- Partials receive data from the controller via the page template; copy
  lives in `src/**/*.content.ts`, not hard-coded in `.hbs` files.
- Adding a new page: create `views/pages/<name>.hbs`, a matching
  `<name>.content.ts`, a controller action that `@Render()`s it, and (if
  it needs page-specific rules) `public/css/pages/<name>.css` linked
  from that page only.

## JavaScript

`public/js/main.js` is a single IIFE, plain DOM APIs only. It is
organized into clearly commented sections (header scroll state, mobile
menu, scroll-reveal, generative canvas art, inquiry form, parallax) —
same one-concern-per-section discipline as the CSS. If the JS surface
grows significantly, split by concern into `public/js/<concern>.js` files
and list them in `views/partials/head-scripts.hbs` in dependency order,
exactly like the CSS cascade.

## When in doubt

1. Is this a color/size/timing value? → token.
2. Does it apply to every page regardless of component? → `base/`.
3. Is it a reusable, named piece of UI? → its own file in `components/`.
4. Is it a one-off arrangement for a single page? → `pages/<page>.css`.

Never skip a layer, never reorder the cascade, never reach for a
framework to solve what a token or a component already can.
