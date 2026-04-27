const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = Array.from(document.querySelectorAll('.nav-link-custom'));
const mobileLinks = Array.from(document.querySelectorAll('.mobile-link'));
const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const sections = Array.from(document.querySelectorAll('section[id]'));

function setScrolledState() {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

function closeMobileMenu() {
  if (!mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

function toggleMobileMenu() {
  const isHidden = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', String(isHidden));
}

function setActiveNavLink() {
  const midpoint = window.scrollY + window.innerHeight * 0.35;
  let currentId = sections[0] ? sections[0].id : '';

  sections.forEach((section) => {
    if (section.offsetTop <= midpoint) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

function initSmoothScroll() {
  allAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 2;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -35px 0px'
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 0.04, 0.28)}s`;
    observer.observe(item);
  });
}

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

let isTicking = false;
function onScroll() {
  if (isTicking) {
    return;
  }

  window.requestAnimationFrame(() => {
    setScrolledState();
    setActiveNavLink();
    isTicking = false;
  });

  isTicking = true;
}

menuToggle.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

document.addEventListener('click', (event) => {
  const clickedInsideMenu = mobileMenu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) {
    closeMobileMenu();
  }
});

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth >= 992) {
    closeMobileMenu();
  }
});

setYear();
setScrolledState();
setActiveNavLink();
initSmoothScroll();
initRevealObserver();
