/**
 * animations.js — Cinematic page transitions + scroll reveals.
 * Multi-panel stagger, spinning tooth logo, floating particles.
 */

'use strict';

const prefersReducedMotionAnim = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  // Handle Hero Sections Immediately
  const heroH1 = document.querySelector('.page-hero h1, .hero-content h1');
  const heroP = document.querySelector('.page-hero p, .hero-content p');
  const heroActions = document.querySelector('.hero-actions, .cta-actions-hero');
  
  if (heroH1) heroH1.classList.add('hero-reveal');
  if (heroP) heroP.classList.add('hero-reveal', 'hero-reveal-delay-1');
  if (heroActions) heroActions.classList.add('hero-reveal', 'hero-reveal-delay-2');

  // Setup Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('is-visible', 'in-view', 'visible');
        
        // Handle child reveals if any
        const children = el.querySelectorAll('[data-reveal-child]');
        children.forEach((child, sec) => {
           setTimeout(() => child.classList.add('is-visible'), sec * 150);
        });

        obs.unobserve(el);
      }
    });
  }, observerOptions);

  // General reveal elements
  document.querySelectorAll('[data-reveal], .page-load-hidden, .doctor-card, .edu-entry').forEach(el => observer.observe(el));

  // Stagger lists
  document.querySelectorAll('.stagger-list').forEach(list => {
    const items = list.querySelectorAll('li, .benefit-item, .stagger-item');
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(item);
    });
  });
}

/* ===================================================================
   PAGE TRANSITIONS — Cinematic Multi-Panel
   =================================================================== */
function initPageTransitions() {
  if (prefersReducedMotionAnim.matches) return;

  const transitionLayer = document.getElementById('page-transition');
  if (!transitionLayer) return;

  // --- ON PAGE LOAD: Play the exit animation (panels slide out) ---
  function playPageEntryAnimation() {
    // If we came from a transition, the panels are covering the screen
    // We need to animate them out
    if (sessionStorage.getItem('pt-navigating')) {
      sessionStorage.removeItem('pt-navigating');
      
      // Start with panels covering the screen
      transitionLayer.classList.add('is-active');
      transitionLayer.classList.remove('is-exiting');
      
      // Force a reflow so the panels are visible immediately
      transitionLayer.offsetHeight;
      
      // After a tiny beat, trigger exit
      requestAnimationFrame(() => {
        setTimeout(() => {
          transitionLayer.classList.add('is-exiting');
          transitionLayer.classList.remove('is-active');
          
          // Clean up after exit animation completes
          setTimeout(() => {
            transitionLayer.classList.remove('is-exiting');
            // Reset all panel transforms
            resetTransition(transitionLayer);
          }, 700);
        }, 200); // Brief pause to show the logo before exiting
      });
    }
  }

  function resetTransition(el) {
    el.classList.remove('is-active', 'is-exiting');
    // Force panels back to initial offscreen state
    const panels = el.querySelectorAll('.pt-panel');
    panels.forEach(p => {
      p.style.transform = '';
    });
  }

  // --- ON LINK CLICK: Play the entry animation (panels slide in) ---
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const target = link.getAttribute('href');
    
    // Skip non-navigating links
    if (!target || 
        target.startsWith('#') || 
        target.startsWith('javascript') || 
        target.startsWith('tel:') || 
        target.startsWith('mailto:') || 
        target.startsWith('https://wa.me') ||
        link.target === '_blank') return;
    
    const isLocal = link.hostname === window.location.hostname || !link.hostname;
    if (!isLocal || e.ctrlKey || e.metaKey) return;

    e.preventDefault();

    // Mark that we're navigating (so the next page plays exit)
    sessionStorage.setItem('pt-navigating', '1');

    // Reset any previous state
    transitionLayer.classList.remove('is-exiting');
    resetTransition(transitionLayer);

    // Force reflow
    transitionLayer.offsetHeight;

    // Activate panels (slide in from bottom, staggered)
    transitionLayer.classList.add('is-active');

    // Navigate after transition completes
    // Panels take ~0.48s + 0.21s delay = ~0.7s, plus logo animation
    setTimeout(() => {
      window.location.href = target;
    }, 800);
  });

  // Handle browser back/forward (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      // Page restored from bfcache, clean up
      resetTransition(transitionLayer);
      sessionStorage.removeItem('pt-navigating');
    }
  });

  // Play entry animation on this page load
  playPageEntryAnimation();
}

/* ===================================================================
   INIT
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initPageTransitions();
});
