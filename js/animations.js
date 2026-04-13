/**
 * animations.js - Dynamic motion, scroll reveals, and page transitions.
 * Implements smooth entrance animations and full-page transition effects.
 */

'use strict';

const prefersReducedMotionAnim = window.matchMedia('(prefers-reduced-motion: reduce)');

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

function initPageTransitions() {
  if (prefersReducedMotionAnim.matches) return;

  const transitionLayer = document.getElementById('page-transition');
  if (!transitionLayer) return;

  // Clear transition layer on load (browser back-button cache prevention)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      transitionLayer.classList.remove('is-active');
    }
  });

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const target = link.getAttribute('href');
      
      // Ignore empty, anchor, script, blank target, or external links
      if (!target || target.startsWith('#') || target.startsWith('javascript') || target.startsWith('tel:') || target.startsWith('mailto:') || link.target === '_blank') return;
      
      const isLocal = link.hostname === window.location.hostname;
      if (isLocal && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        transitionLayer.classList.add('is-active');
        
        setTimeout(() => {
          window.location.href = target;
        }, 600); // matches css 0.6s
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initPageTransitions();
});

