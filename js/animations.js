/**
 * animations.js - logo-led page transitions + scroll reveals.
 * Makes page switches feel branded while keeping motion optional.
 */

'use strict';

const prefersReducedMotionAnim = window.matchMedia('(prefers-reduced-motion: reduce)');

const TRANSITION_STATE_KEY = 'pt-transition-state';
const TRANSITION_MAX_AGE_MS = 6000;
const TRANSITION_EXIT_MS = 920;
const TRANSITION_REVEAL_MS = 880;
const TRANSITION_BADGE_SIZE = 112;
const DEFAULT_BRAND_LABEL = 'Agarwal Dental';

/* ===================================================================
   SCROLL REVEALS
   =================================================================== */
function initScrollReveals() {
  document.body.classList.add('page-loaded');

  if (prefersReducedMotionAnim.matches || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal], .page-load-hidden, .doctor-card[data-reveal], .edu-entry, .stagger-item, .stagger-list li, .stagger-list .benefit-item').forEach((el) => {
      el.classList.add('is-visible', 'in-view', 'visible');
    });
    return;
  }

  const heroH1 = document.querySelector('.page-hero h1, .hero-content h1');
  const heroP = document.querySelector('.page-hero p, .hero-content p');
  const heroActions = document.querySelector('.hero-actions, .cta-actions-hero');

  if (heroH1) heroH1.classList.add('hero-reveal');
  if (heroP) heroP.classList.add('hero-reveal', 'hero-reveal-delay-1');
  if (heroActions) heroActions.classList.add('hero-reveal', 'hero-reveal-delay-2');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('is-visible', 'in-view', 'visible');

      el.querySelectorAll('[data-reveal-child]').forEach((child, index) => {
        window.setTimeout(() => child.classList.add('is-visible'), index * 150);
      });

      obs.unobserve(el);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  });

  document.querySelectorAll('[data-reveal], .page-load-hidden, .doctor-card, .edu-entry').forEach((el) => observer.observe(el));

  document.querySelectorAll('.stagger-list').forEach((list) => {
    list.querySelectorAll('li, .benefit-item, .stagger-item').forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(item);
    });
  });
}

/* ===================================================================
   PAGE TRANSITIONS - Logo-led handoff
   =================================================================== */
function getTransitionTemplate() {
  return `
    <div class="pt-panel-track" aria-hidden="true">
      <div class="pt-panel pt-panel-1"></div>
      <div class="pt-panel pt-panel-2"></div>
      <div class="pt-panel pt-panel-3"></div>
      <div class="pt-panel pt-panel-4"></div>
    </div>
    <div class="pt-noise" aria-hidden="true"></div>
    <div class="pt-particles" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="pt-center" aria-hidden="true">
      <div class="pt-glow"></div>
      <div class="pt-orbit pt-orbit-a"></div>
      <div class="pt-orbit pt-orbit-b"></div>
      <div class="pt-logo-flight">
        <div class="pt-logo-shell">
          <img class="pt-logo-image" alt="" />
          <span class="pt-logo-fallback">AD</span>
        </div>
      </div>
      <div class="pt-copy">
        <span class="pt-wordmark">${DEFAULT_BRAND_LABEL}</span>
        <span class="pt-tagline">Precision smile care</span>
      </div>
    </div>
  `;
}

function ensureTransitionLayer() {
  let layer = document.getElementById('page-transition');

  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'page-transition';
    document.body.prepend(layer);
  }

  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = getTransitionTemplate();
  return layer;
}

function getBrandElement() {
  const selectors = [
    '.navbar .logo',
    '.logo',
    '.nav-logo',
    '.mobile-menu-brand'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }

  return null;
}

function compactBrandLabel(label) {
  if (!label) return DEFAULT_BRAND_LABEL;

  return label
    .replace(/\s+/g, ' ')
    .replace(/Dental Health Clinic(?:\s*&\s*Implant Centre)?/i, 'Dental')
    .trim() || DEFAULT_BRAND_LABEL;
}

function getBranding() {
  const brandEl = getBrandElement();
  const imageEl = brandEl?.querySelector('img') || document.querySelector('.logo img, .nav-logo img');
  const rawLabel = brandEl?.textContent?.replace(/\s+/g, ' ').trim() || DEFAULT_BRAND_LABEL;
  const label = compactBrandLabel(rawLabel);
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'AD';

  return {
    label,
    initials,
    imageSrc: imageEl?.currentSrc || imageEl?.getAttribute('src') || ''
  };
}

function applyBranding(layer, brand) {
  const safeBrand = brand || getBranding();
  const wordmark = layer.querySelector('.pt-wordmark');
  const tagline = layer.querySelector('.pt-tagline');
  const image = layer.querySelector('.pt-logo-image');
  const fallback = layer.querySelector('.pt-logo-fallback');
  const usesImage = Boolean(safeBrand.imageSrc);

  if (wordmark) wordmark.textContent = safeBrand.label || DEFAULT_BRAND_LABEL;
  if (tagline) tagline.textContent = 'Precision smile care';
  if (fallback) fallback.textContent = safeBrand.initials || 'AD';

  layer.dataset.ptLogoMode = usesImage ? 'image' : 'text';

  if (image) {
    if (usesImage) {
      image.src = safeBrand.imageSrc;
      image.alt = `${safeBrand.label || DEFAULT_BRAND_LABEL} logo`;
    } else {
      image.removeAttribute('src');
      image.alt = '';
    }
  }
}

function getLogoMotionSource() {
  const candidates = [
    '.navbar .logo .logo-icon',
    '.logo .logo-icon',
    '.nav-logo .logo-text',
    '.nav-logo',
    '.logo',
    '.mobile-menu-brand'
  ];

  for (const selector of candidates) {
    const el = document.querySelector(selector);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return rect;
  }

  return null;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizePathname(pathname) {
  const path = (pathname || '/')
    .replace(/\\/g, '/')
    .replace(/index\.html$/i, '')
    .replace(/\/+$/, '/')
    .toLowerCase();

  return path || '/';
}

function setFlightVectors(layer, fromRect, toRect) {
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;

  function toVector(rect, fallback) {
    if (!rect) return fallback;

    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const referenceSize = Math.max(Math.min(rect.width, rect.height), 40);

    return {
      x: centerX - viewportCenterX,
      y: centerY - viewportCenterY,
      scale: clamp(referenceSize / TRANSITION_BADGE_SIZE, 0.34, 1.18)
    };
  }

  const from = toVector(fromRect, {
    x: 0,
    y: Math.min(-window.innerHeight * 0.28, -150),
    scale: 0.38
  });

  const to = toVector(toRect, {
    x: Math.min(-window.innerWidth * 0.28, -160),
    y: Math.min(-window.innerHeight * 0.3, -180),
    scale: 0.42
  });

  layer.style.setProperty('--pt-logo-from-x', `${from.x.toFixed(1)}px`);
  layer.style.setProperty('--pt-logo-from-y', `${from.y.toFixed(1)}px`);
  layer.style.setProperty('--pt-logo-from-scale', from.scale.toFixed(3));
  layer.style.setProperty('--pt-logo-to-x', `${to.x.toFixed(1)}px`);
  layer.style.setProperty('--pt-logo-to-y', `${to.y.toFixed(1)}px`);
  layer.style.setProperty('--pt-logo-to-scale', to.scale.toFixed(3));
}

function storeTransitionState(brand) {
  try {
    sessionStorage.setItem(TRANSITION_STATE_KEY, JSON.stringify({
      brand,
      time: Date.now()
    }));
  } catch (error) {
    // Ignore storage failures and fall back to a normal navigation.
  }
}

function readTransitionState() {
  try {
    const raw = sessionStorage.getItem(TRANSITION_STATE_KEY);
    if (!raw) return null;

    sessionStorage.removeItem(TRANSITION_STATE_KEY);

    const parsed = JSON.parse(raw);
    if (!parsed?.time) return null;
    if (Date.now() - parsed.time > TRANSITION_MAX_AGE_MS) return null;

    return parsed;
  } catch (error) {
    sessionStorage.removeItem(TRANSITION_STATE_KEY);
    return null;
  }
}

function resetTransitionLayer(layer) {
  layer.classList.remove('is-active', 'is-entering', 'is-primed', 'is-revealing');
}

function isTransitionableLink(link, event) {
  if (!link || event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target === '_blank' || link.hasAttribute('download') || link.dataset.noTransition !== undefined) return false;

  const rawHref = link.getAttribute('href');
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return false;

  let url;

  try {
    url = new URL(rawHref, window.location.href);
  } catch (error) {
    return false;
  }

  if (!['http:', 'https:', 'file:'].includes(url.protocol)) return false;
  if (url.protocol === 'mailto:' || url.protocol === 'tel:') return false;

  if (window.location.protocol === 'file:' || url.protocol === 'file:') {
    if (url.protocol !== window.location.protocol) return false;
  } else if (url.origin !== window.location.origin) {
    return false;
  }

  const currentPath = normalizePathname(window.location.pathname);
  const targetPath = normalizePathname(url.pathname);

  if (currentPath === targetPath && url.search === window.location.search) return false;

  return true;
}

function playEntryTransition(layer, brand) {
  applyBranding(layer, brand || getBranding());
  setFlightVectors(layer, null, getLogoMotionSource());
  layer.classList.add('is-active', 'is-primed');

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      layer.classList.remove('is-primed', 'is-entering');
      layer.classList.add('is-revealing');

      window.setTimeout(() => {
        resetTransitionLayer(layer);
      }, TRANSITION_REVEAL_MS);
    });
  });
}

function initPageTransitions() {
  if (prefersReducedMotionAnim.matches) return;

  const layer = ensureTransitionLayer();
  const storedState = readTransitionState();
  let isNavigating = false;

  if (storedState?.brand) playEntryTransition(layer, storedState.brand);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!isTransitionableLink(link, event) || isNavigating) return;

    const targetUrl = new URL(link.getAttribute('href'), window.location.href);
    const brand = getBranding();

    isNavigating = true;
    event.preventDefault();

    applyBranding(layer, brand);
    setFlightVectors(layer, getLogoMotionSource(), null);
    resetTransitionLayer(layer);
    void layer.offsetWidth;

    storeTransitionState(brand);

    layer.classList.add('is-active', 'is-entering');

    window.setTimeout(() => {
      window.location.href = targetUrl.href;
    }, TRANSITION_EXIT_MS);
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;

    isNavigating = false;
    resetTransitionLayer(layer);

    try {
      sessionStorage.removeItem(TRANSITION_STATE_KEY);
    } catch (error) {
      // Nothing else to do.
    }
  });
}

/* ===================================================================
   INIT
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initPageTransitions();
});
