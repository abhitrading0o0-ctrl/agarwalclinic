/**
 * main.js - shared navigation and lightweight interactions
 * Keeps content visible while adding polished, device-friendly UI behaviour.
 */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const TOOTH_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C8.5 2 6 4 6 7c0 1.5.5 3 1.5 4.5C9 14 9 17 9 19c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2 0-2 0-5 1.5-7.5C17.5 10 18 8.5 18 7c0-3-2.5-5-6-5z"></path>
  </svg>
`;

const ICONS = {
  home: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5"></path>
      <path d="M6.5 10.5V19h11v-8.5"></path>
    </svg>
  `,
  about: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M12 10v5"></path>
      <path d="M12 7.5h.01"></path>
    </svg>
  `,
  services: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c-3 0-5 1.8-5 4.3 0 1 .3 1.9.9 2.8C9 12 9 14.2 9 16.6c0 .8.6 1.4 1.4 1.4h3.2c.8 0 1.4-.6 1.4-1.4 0-2.4 0-4.6 1.1-6.5.6-.9.9-1.8.9-2.8C17 4.8 15 3 12 3Z"></path>
      <path d="M10 20h4"></path>
    </svg>
  `,
  implant: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4"></path>
      <path d="M11 6h2"></path>
      <path d="M10 9h4"></path>
      <path d="M10 12h4"></path>
      <path d="M10.5 15h3"></path>
      <path d="M9 19h6"></path>
      <path d="M8 19c0 1.1 1.8 2 4 2s4-.9 4-2"></path>
    </svg>
  `,
  smile: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8.5" cy="10" r="1"></circle>
      <circle cx="15.5" cy="10" r="1"></circle>
      <path d="M7 14c1.2 1.5 2.9 2.2 5 2.2s3.8-.7 5-2.2"></path>
      <path d="M12 3c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9Z"></path>
    </svg>
  `,
  align: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14"></path>
      <path d="M5 16h14"></path>
      <path d="M8 8v8"></path>
      <path d="M12 8v8"></path>
      <path d="M16 8v8"></path>
    </svg>
  `,
  root: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3v7"></path>
      <path d="M14 3v7"></path>
      <path d="M8 7c0 2 1 3.5 2.3 4.6 1.1.9 1.7 2 1.7 3.5V21"></path>
      <path d="M16 7c0 2-1 3.5-2.3 4.6-1.1.9-1.7 2-1.7 3.5"></path>
    </svg>
  `,
  shine: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"></path>
      <path d="M18 4v2"></path>
      <path d="M19 5h-2"></path>
    </svg>
  `,
  gum: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20c-3.8 0-7-3.1-7-7 0-4.7 3.7-9 7-10 3.3 1 7 5.3 7 10 0 3.9-3.2 7-7 7Z"></path>
      <path d="M12 7v9"></path>
      <path d="M9 10.5c1 .4 2 .6 3 .6s2-.2 3-.6"></path>
    </svg>
  `,
  surgery: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4v6"></path>
      <path d="M10 4v6"></path>
      <path d="M8.5 10v10"></path>
      <path d="M15 4c1.7 1.4 2.7 3 2.7 5.1 0 1.8-.8 3-2.2 3.9-.6.4-1 .9-1 1.7V20"></path>
    </svg>
  `,
  crown: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 7 3.5 3L12 4l4.5 6L20 7l-2 10H6L4 7Z"></path>
      <path d="M7 20h10"></path>
    </svg>
  `,
  doctor: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.5" r="3"></circle>
      <path d="M6 19c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5"></path>
      <path d="M12 5.5v4"></path>
      <path d="M10 7.5h4"></path>
    </svg>
  `,
  contact: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8.5C5 6 7 4 9.5 4h5C17 4 19 6 19 8.5v7c0 2.5-2 4.5-4.5 4.5h-5C7 20 5 18 5 15.5v-7Z"></path>
      <path d="m7.5 8.5 4.5 4 4.5-4"></path>
    </svg>
  `,
  appointment: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3"></path>
      <path d="M17 3v3"></path>
      <path d="M4 9h16"></path>
      <rect x="4" y="5.5" width="16" height="14.5" rx="3"></rect>
    </svg>
  `,
  phone: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h3l1.2 4-2 1.7c1.3 2.4 3.2 4.3 5.6 5.6l1.7-2L21 14v3c0 1.1-.9 2-2 2-7.7 0-14-6.3-14-14 0-1.1.9-2 2-2Z"></path>
    </svg>
  `
};

function setCounterText(el, value) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  el.textContent = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
}

function makeContentVisible() {
  document.querySelectorAll('[data-reveal], .page-load-hidden, .doctor-card[data-reveal], .edu-entry, .stagger-item, .stagger-list li, .stagger-list .benefit-item').forEach((el) => {
    el.classList.add('is-visible', 'in-view', 'visible');
  });
}

function ensureRevealFallback() {
  window.setTimeout(() => {
    if (document.body.classList.contains('page-loaded')) return;
    makeContentVisible();
  }, 0);
}

function getNavRootPrefix() {
  const logoHref = document.querySelector('.navbar .logo')?.getAttribute('href') || 'index.html';
  const cleanedHref = logoHref.split('#')[0];
  const indexMatch = cleanedHref.match(/^(.*)index\.html$/i);

  if (indexMatch) return indexMatch[1];

  const lastSlash = cleanedHref.lastIndexOf('/');
  return lastSlash >= 0 ? cleanedHref.slice(0, lastSlash + 1) : '';
}

function getCurrentArea() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();

  if (path.includes('/services/')) return 'services';
  if (path.includes('/doctors/')) return 'doctors';
  if (path.endsWith('/about.html')) return 'about';
  if (path.endsWith('/contact.html')) return 'contact';
  if (path.endsWith('/appointment.html')) return 'appointment';
  if (path.endsWith('/index.html') || path.endsWith('/')) return 'home';
  return 'home';
}

function getNavigationData(rootPrefix) {
  return {
    primary: [
      {
        key: 'home',
        label: 'Home',
        sublabel: 'Clinic overview',
        href: `${rootPrefix}index.html`,
        icon: 'home',
        tone: 'tone-blue',
        img: `${rootPrefix}images/generated/hero_bg.png`
      },
      {
        key: 'about',
        label: 'About Us',
        sublabel: 'Story and values',
        href: `${rootPrefix}about.html`,
        icon: 'about',
        tone: 'tone-cyan',
        img: `${rootPrefix}images/generated/why_us_bg.jpg`
      }
    ],
    services: [
      {
        label: 'Dental Implants',
        sublabel: 'Permanent tooth replacement',
        href: `${rootPrefix}services/dental-implants.html`,
        icon: 'implant',
        tone: 'tone-blue',
        img: `${rootPrefix}images/generated/dental_implants.png`
      },
      {
        label: 'Smile Designing',
        sublabel: 'Cosmetic smile makeover',
        href: `${rootPrefix}services/smile-designing.html`,
        icon: 'smile',
        tone: 'tone-amber',
        img: `${rootPrefix}images/generated/smile_designing.png`
      },
      {
        label: 'Orthodontics',
        sublabel: 'Braces and aligners',
        href: `${rootPrefix}services/orthodontic-treatment.html`,
        icon: 'align',
        tone: 'tone-lilac',
        img: `${rootPrefix}images/generated/ortho_treatment.png`
      },
      {
        label: 'Root Canal Therapy',
        sublabel: 'Save painful teeth',
        href: `${rootPrefix}services/root-canal-therapy.html`,
        icon: 'root',
        tone: 'tone-sky',
        img: `${rootPrefix}images/generated/root_canal.png`
      },
      {
        label: 'Teeth Whitening',
        sublabel: 'Brighten your smile',
        href: `${rootPrefix}services/teeth-whitening.html`,
        icon: 'shine',
        tone: 'tone-gold',
        img: `${rootPrefix}images/generated/teeth_whitening.png`
      },
      {
        label: 'Gum Treatment',
        sublabel: 'Healthy gums first',
        href: `${rootPrefix}services/gum-treatment.html`,
        icon: 'gum',
        tone: 'tone-green',
        img: `${rootPrefix}images/generated/gum_treatment.png`
      },
      {
        label: 'Oral Surgery',
        sublabel: 'Precision surgical care',
        href: `${rootPrefix}services/oral-surgery.html`,
        icon: 'surgery',
        tone: 'tone-indigo',
        img: `${rootPrefix}images/generated/oral_surgery.jpg`
      },
      {
        label: 'Crowns & Capping',
        sublabel: 'Restore shape and strength',
        href: `${rootPrefix}services/crowns-and-capping.html`,
        icon: 'crown',
        tone: 'tone-rose',
        img: `${rootPrefix}images/generated/crowns_and_capping.png`
      }
    ],
    doctors: [
      {
        label: 'Dr. Ajay Agarwal',
        sublabel: 'Implants and oral surgery',
        href: `${rootPrefix}doctors/dr-ajay-agarwal.html`,
        icon: 'doctor',
        tone: 'tone-blue',
        img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80'
      },
      {
        label: 'Dr. Rachana Agarwal',
        sublabel: 'Orthodontics and smile design',
        href: `${rootPrefix}doctors/dr-rachana-agarwal.html`,
        icon: 'doctor',
        tone: 'tone-cyan',
        img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80'
      }
    ],
    secondary: [
      {
        key: 'doctors',
        label: 'Our Doctors',
        href: `${rootPrefix}doctors/dr-ajay-agarwal.html`
      },
      {
        key: 'contact',
        label: 'Contact',
        href: `${rootPrefix}contact.html`
      }
    ],
    appointmentHref: `${rootPrefix}appointment.html`
  };
}

function getIconMarkup(name) {
  return ICONS[name] || ICONS.services;
}

function buildDesktopNavigation(navData, activeArea) {
  const serviceCards = navData.services
    .map((item) => {
      return `
        <a href="${item.href}" class="nav-dropdown-item">
          <span class="nav-dropdown-icon ${item.tone}">${getIconMarkup(item.icon)}</span>
          <span class="nav-dropdown-copy">
            <strong>${item.label}</strong>
            <small>${item.sublabel}</small>
          </span>
        </a>
      `;
    })
    .join('');

  return `
    <a href="${navData.primary[0].href}" class="nav-link${activeArea === 'home' ? ' active' : ''}" role="menuitem">Home</a>
    <a href="${navData.primary[1].href}" class="nav-link${activeArea === 'about' ? ' active' : ''}" role="menuitem">About</a>
    <div class="nav-dropdown-group${activeArea === 'services' ? ' active' : ''}">
      <button class="nav-link nav-link-button nav-services-toggle" type="button" aria-haspopup="true" aria-expanded="false">
        <span>Services</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 8L1 3h10z"></path></svg>
      </button>
      <div class="nav-dropdown-menu" role="menu" aria-label="Services">
        <div class="nav-dropdown-head">
          <span class="nav-dropdown-kicker">Smile Design System</span>
          <h4>Specialized care with premium dental presentation.</h4>
        </div>
        <div class="nav-dropdown-grid">
          ${serviceCards}
        </div>
      </div>
    </div>
    <a href="${navData.secondary[0].href}" class="nav-link${activeArea === 'doctors' ? ' active' : ''}" role="menuitem">Our Doctors</a>
    <a href="${navData.secondary[1].href}" class="nav-link${activeArea === 'contact' ? ' active' : ''}" role="menuitem">Contact</a>
  `;
}

function buildMobileLink(item, active, index) {
  const visual = item.img 
    ? `<img src="${item.img}" class="mobile-menu-img" alt="${item.label}" loading="lazy">` 
    : `<span class="menu-icon ${item.tone}">${getIconMarkup(item.icon)}</span>`;

  return `
    <a href="${item.href}" class="mobile-link-card${active ? ' active' : ''}" style="--item-index:${index}">
      <div class="mobile-menu-img-wrapper">
        ${visual}
      </div>
      <span class="mobile-link-copy">
        <strong>${item.label}</strong>
        <small>${item.sublabel}</small>
      </span>
    </a>
  `;
}

function buildMobileMenu(navData, activeArea, rootPrefix) {
  let itemIndex = 0;

  const primaryLinks = navData.primary
    .map((item) => buildMobileLink(item, activeArea === item.key, itemIndex++))
    .join('');

  const serviceLinks = navData.services
    .map((item) => buildMobileLink(item, activeArea === 'services' && window.location.pathname.toLowerCase().includes(item.href.split('/').pop().toLowerCase()), itemIndex++))
    .join('');

  const doctorLinks = navData.doctors
    .map((item) => buildMobileLink(item, activeArea === 'doctors' && window.location.pathname.toLowerCase().includes(item.href.split('/').pop().toLowerCase()), itemIndex++))
    .join('');

  const contactCard = buildMobileLink(
    {
      href: `${rootPrefix}contact.html`,
      label: 'Contact Clinic',
      sublabel: 'Call, WhatsApp, or visit',
      icon: 'contact',
      tone: 'tone-blue',
      img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&q=80'
    },
    activeArea === 'contact',
    itemIndex++
  );

  return `
    <div class="mobile-menu-shell">
      <div class="mobile-menu-header">
        <a href="${rootPrefix}index.html" class="mobile-menu-brand">
          <span class="mobile-menu-brand-icon">${TOOTH_ICON}</span>
          <span class="mobile-menu-brand-copy">
            <strong>Agarwal Dental</strong>
            <small>Precision smile care</small>
          </span>
        </a>
        <button class="mobile-menu-close" type="button" aria-label="Close menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      </div>

      <div class="mobile-menu-body">
        <div class="mobile-menu-status" style="--item-index:${itemIndex++}">
          <span class="mobile-menu-status-dot"></span>
          Open Monday to Saturday, 9 AM to 7 PM
        </div>

        <div class="mobile-menu-section">
          <div class="mobile-menu-grid">
            ${primaryLinks}
          </div>
        </div>

        <div class="mobile-menu-section">
          <div class="mobile-menu-section-title">Services</div>
          <div class="mobile-menu-grid">
            ${serviceLinks}
          </div>
        </div>

        <div class="mobile-menu-section">
          <div class="mobile-menu-section-title">Doctors</div>
          <div class="mobile-menu-grid">
            ${doctorLinks}
          </div>
        </div>

        <div class="mobile-menu-section">
          <div class="mobile-menu-grid">
            ${contactCard}
          </div>
        </div>

        <div class="mobile-menu-footer">
          <a href="${navData.appointmentHref}" class="btn btn-primary btn-full mobile-menu-cta">
            ${getIconMarkup('appointment')}
            Book Appointment
          </a>
          <a href="tel:+919412589572" class="mobile-menu-chip">
            <span class="mobile-menu-chip-icon">${getIconMarkup('phone')}</span>
            <span class="mobile-menu-chip-copy">
              <strong>Call Clinic</strong>
              <small>+91 94125 89572</small>
            </span>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderSharedNavigation() {
  const navLinks = document.querySelector('.nav-links');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hamburger = document.querySelector('.hamburger');

  if (!navLinks && !mobileMenu) return;

  const rootPrefix = getNavRootPrefix();
  const activeArea = getCurrentArea();
  const navData = getNavigationData(rootPrefix);

  if (navLinks) {
    navLinks.setAttribute('role', 'menubar');
    navLinks.innerHTML = buildDesktopNavigation(navData, activeArea);
  }

  if (mobileMenu) {
    mobileMenu.setAttribute('role', 'dialog');
    mobileMenu.setAttribute('aria-modal', 'true');
    mobileMenu.setAttribute('aria-label', 'Site navigation');
    mobileMenu.innerHTML = buildMobileMenu(navData, activeArea, rootPrefix);
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  }
}

function initServicesDropdown() {
  const group = document.querySelector('.nav-dropdown-group');
  const toggle = group?.querySelector('.nav-services-toggle');

  if (!group || !toggle) return;

  function setDropdownState(isOpen) {
    group.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  }

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    setDropdownState(!group.classList.contains('open'));
  });

  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setDropdownState(false);
  });

  document.addEventListener('click', (event) => {
    if (!group.contains(event.target)) setDropdownState(false);
  });
}

function initNav() {
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');
  let ticking = false;

  function updateNavState() {
    const scrollY = window.scrollY;
    navbar?.classList.toggle('scrolled', scrollY > 20);
    scrollTopBtn?.classList.toggle('visible', scrollY > 320);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNavState);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pageshow', updateNavState);
  updateNavState();

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // CUSTOM SMOOTH ANCHOR SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - (headerH - 5);
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, href);
      }
    });
  });
}

function initMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.menu-backdrop');
  const closeButton = mobileMenu?.querySelector('.mobile-menu-close');
  const mobileMenuBody = mobileMenu?.querySelector('.mobile-menu-body');
  let lockedScrollY = 0;

  if (!hamburger || !mobileMenu) return;

  function setMenuState(isOpen) {
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    backdrop?.classList.toggle('open', isOpen);
    
    if (isOpen) {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
      mobileMenu.scrollTop = 0;
      if (mobileMenuBody) mobileMenuBody.scrollTop = 0;
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
      window.scrollTo(0, lockedScrollY);
    }
    
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', () => {
    setMenuState(!hamburger.classList.contains('open'));
  });

  closeButton?.addEventListener('click', () => setMenuState(false));
  backdrop?.addEventListener('click', () => setMenuState(false));

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenuState(false);
  });
}

function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('open');

      items.forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
    });
  });
}

function animateCounter(el) {
  const target = Number(el.dataset.target);
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion.matches) {
    setCounterText(el, target);
    el.classList.add('counted');
    return;
  }

  const duration = 900;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setCounterText(el, Math.round(target * eased));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      setCounterText(el, target);
      el.classList.add('counted');
    }
  }

  window.requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      const target = Number(el.dataset.target);
      if (Number.isFinite(target)) setCounterText(el, target);
      el.classList.add('counted');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', () => {
  renderSharedNavigation();
  ensureRevealFallback();
  initServicesDropdown();
  initNav();
  initMenu();
  initFAQ();
  initCounters();
});

// pageshow animation handled by animations.js
