// ===== Navbar scroll state =====
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
}

// ===== Mobile menu: circular reveal from the toggle, links rise in one by one =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
let menuTl = null;

function buildMenuTimeline() {
  // the circle grows out of the hamburger button, wherever it sits
  const r = navToggle.getBoundingClientRect();
  const at = `at ${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
  const labels = mobileMenu.querySelectorAll('.mm-inner');
  const foot = mobileMenu.querySelector('.mobile-menu-foot');

  return gsap
    .timeline({ paused: true })
    .set(mobileMenu, { visibility: 'visible' })
    .fromTo(
      mobileMenu,
      { clipPath: `circle(0px ${at})` },
      { clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight) * 1.05}px ${at})`, duration: 0.75, ease: 'power3.inOut' }
    )
    .fromTo(labels, { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.6, ease: 'power3.out', stagger: 0.055 }, 0.32)
    .fromTo(foot, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.62);
}

function setMenu(open) {
  if (!navToggle || !mobileMenu || !window.gsap || open === menuOpen) return;
  menuOpen = open;
  if (!menuTl) menuTl = buildMenuTimeline();

  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.getElementById('navbar').classList.toggle('menu-open', open);
  document.documentElement.style.overflow = open ? 'hidden' : '';

  if (open) menuTl.timeScale(1).play();
  else menuTl.timeScale(1.35).reverse();
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  // the reveal origin depends on the layout, so rebuild it after a resize/rotation
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 761px)').matches) setMenu(false);
    if (!menuOpen && menuTl) {
      menuTl.kill();
      menuTl = null;
      gsap.set(mobileMenu, { visibility: 'hidden', clearProps: 'clipPath' });
    }
  });
}

// ===== Hero superhero carousel =====
// Two heroes on screen at once:
//   FOCUS      – sharp, bottom: 0 / right: 30px, behind
//   FOREGROUND – blurred, bottom: 0 / right: -20% (bleeds off the screen), on top
// Each step is a camera "rack focus": the focused hero pushes forward into the blurred
// foreground spot, the next hero emerges from behind it into sharp focus, and the old
// foreground hero flies off past the right edge and disappears.
const heroCarousel = document.getElementById('heroCarousel');

if (heroCarousel && window.gsap) {
  const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // tablet + phone: slides are centered in the carousel, so offsets are measured from the center
  const isCompact = () => window.matchMedia('(max-width: 1080px)').matches;
  const W = () => heroCarousel.offsetWidth;

  if (reduceMotion || slides.length < 2) {
    // no motion wanted: just show the first hero
    gsap.set(slides[0], { opacity: 1, x: isCompact() ? -W() * 0.07 : 0 });
  } else {
    const n = slides.length;
    const HOLD = 2.2; // seconds each hero stays sharp
    const SWAP = 0.85; // seconds for the rack-focus swap

    // desktop: sharp hero rests at right: 30px, blurred one slides to right: -20%
    // compact: sharp hero sits a little left of center, blurred one bleeds off the right edge
    const focusX = () => (isCompact() ? -W() * 0.07 : 0);
    const fgX = () => (isCompact() ? W() * 0.31 : W() * 0.2 + 30);
    const exitX = () => fgX() + W() * (isCompact() ? 0.6 : 0.35);

    const FOCUS = { x: focusX, scale: 1, opacity: 1, filter: 'blur(0px) brightness(1)' };
    // smaller screens get a lighter blur and brightness drop so the foreground hero stays visible
    const FOREGROUND = {
      x: fgX,
      scale: 1.1,
      opacity: 1,
      filter: () => (isCompact() ? 'blur(7px) brightness(0.92)' : 'blur(12px) brightness(0.8)'),
    };
    const EXIT = { x: exitX, scale: 1.3, opacity: 0, filter: 'blur(22px) brightness(0.7)' };
    // where a new hero starts: tucked behind the focused one, smaller and out of focus
    const BEHIND = { x: () => focusX() - W() * 0.05, scale: 0.88, opacity: 0, filter: 'blur(14px) brightness(0.6)' };

    gsap.set(slides, { ...BEHIND, zIndex: 0 });

    let focusIndex = 0;
    let fgIndex = -1; // nobody in the foreground until the first swap

    // opening: the first hero emerges from behind into focus
    gsap.set(slides[focusIndex], { zIndex: 2 });
    gsap.to(slides[focusIndex], { ...FOCUS, duration: 1.1, ease: 'power3.out', delay: 0.3 });

    function swap() {
      const nextIndex = (focusIndex + 1) % n;

      // 1) old blurred foreground hero flies off the right edge and disappears
      if (fgIndex !== -1) {
        const leaving = slides[fgIndex];
        gsap.set(leaving, { zIndex: 4 });
        gsap.to(leaving, {
          ...EXIT,
          duration: SWAP,
          ease: 'power2.in',
          onComplete: () => gsap.set(leaving, { ...BEHIND, zIndex: 0 }),
        });
      }

      // 2) focused hero pushes forward into the blurred foreground spot, on top
      gsap.set(slides[focusIndex], { zIndex: 3 });
      gsap.to(slides[focusIndex], { ...FOREGROUND, duration: SWAP, ease: 'power3.inOut' });

      // 3) next hero comes out from behind and racks into sharp focus
      gsap.set(slides[nextIndex], { ...BEHIND, zIndex: 1 });
      gsap.to(slides[nextIndex], {
        ...FOCUS,
        duration: SWAP,
        delay: 0.12,
        ease: 'power3.out',
        onComplete: () => gsap.set(slides[nextIndex], { zIndex: 2 }),
      });

      fgIndex = focusIndex;
      focusIndex = nextIndex;
      gsap.delayedCall(SWAP + HOLD, swap);
    }

    gsap.delayedCall(1.4 + HOLD, swap);

    // keep both heroes in their spots when the window is resized or rotated
    window.addEventListener('resize', () => {
      if (!gsap.isTweening(slides[focusIndex])) gsap.set(slides[focusIndex], { x: focusX() });
      if (fgIndex !== -1 && !gsap.isTweening(slides[fgIndex])) gsap.set(slides[fgIndex], { x: fgX() });
    });
  }
}

// ===== Sports tabs =====
const sportTabs = document.querySelectorAll('.sport-tab');
const sportBlocks = document.querySelectorAll('.sport-block');

sportTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;

    sportTabs.forEach((t) => t.classList.toggle('active', t === tab));
    sportBlocks.forEach((block) => {
      block.classList.toggle('is-active', block.id === target);
    });
  });
});

// ===== Fly transition (Iron Man flies right-to-left into Food) =====
const flyIronman = document.getElementById('flyIronman');
const flyIronmanTrail = document.getElementById('flyIronmanTrail');
const foodReveal = document.getElementById('foodReveal');
const flyGlow = document.querySelector('.fly-glow');
const flyFlash = document.getElementById('flyFlash');
const flyBg = document.getElementById('flyBg');
const flyVideo = document.getElementById('flyVideo');

const isPhone = window.matchMedia('(max-width: 760px)').matches;

if (!isPhone && flyIronman && foodReveal && window.gsap && window.ScrollTrigger) {
  // anchor Iron Man (and his trail ghost) on their own center
  gsap.set([flyIronman, flyIronmanTrail].filter(Boolean), { xPercent: -50, yPercent: -50 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#food',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });

  // the whole scene opens blurred, like it's still out of focus as it scrolls up
  if (flyBg) {
    // stays a soft bokeh backdrop throughout: opens heavily blurred, settles to a
    // gentle depth-of-field blur rather than ever going fully sharp
    gsap.set(flyBg, { filter: 'blur(32px)', scale: 1.08 });
    tl.to(flyBg, { filter: 'blur(9px)', scale: 1, ease: 'power2.out', duration: 0.7 }, 0);
  }

  // leg 1: swoops in from far right, banked, rising, with a squash as he "catches air"
  tl.fromTo(
    flyIronman,
    { x: '150vw', y: '-9%', rotate: -12, scaleX: 0.8, scaleY: 0.98 },
    { x: '8vw', y: '1%', rotate: 0, scaleX: 1.08, scaleY: 1.08, ease: 'power3.out', duration: 0.48 },
    0
  )
    // leg 2: banks the other way and stretches/accelerates off-screen, selling raw speed
    .to(
      flyIronman,
      { x: '-62vw', y: '-4%', rotate: 8, scaleX: 1.32, scaleY: 0.82, ease: 'power4.in', duration: 0.52 },
      0.48
    )
    // the food panel trails in behind him, slightly delayed, coming into focus as it lands
    .fromTo(
      foodReveal,
      { x: '60vw', y: '14px', opacity: 0, scale: 0.96, filter: 'blur(14px)' },
      { x: '0vw', y: '0px', opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power3.out', duration: 0.62 },
      0.3
    );

  // a motion-blur ghost that lags slightly behind him, same path, offset in time
  if (flyIronmanTrail) {
    tl.fromTo(
      flyIronmanTrail,
      { x: '150vw', y: '-9%', rotate: -12, scaleX: 0.8, scaleY: 0.98, opacity: 0 },
      { x: '8vw', y: '1%', rotate: 0, scaleX: 1.08, scaleY: 1.08, opacity: 0.4, ease: 'power3.out', duration: 0.48 },
      0.045
    ).to(
      flyIronmanTrail,
      { x: '-62vw', y: '-4%', rotate: 8, scaleX: 1.32, scaleY: 0.82, opacity: 0, ease: 'power4.in', duration: 0.52 },
      0.525
    );
  }

  // a quick bright whoosh as he crosses dead-center
  if (flyFlash) {
    tl.fromTo(flyFlash, { opacity: 0 }, { opacity: 0.85, ease: 'power1.in', duration: 0.1 }, 0.4).to(
      flyFlash,
      { opacity: 0, ease: 'power1.out', duration: 0.2 },
      0.5
    );
  }

  // ambient glow breathing, independent of scroll, for a bit of life while reading
  if (flyGlow) {
    gsap.to(flyGlow, {
      scale: 1.08,
      opacity: 0.85,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '88% 46%',
    });
  }
}

// ===== Food video: play, then pause 3s on each loop before replaying =====
if (flyVideo) {
  flyVideo.play().catch(() => {});

  flyVideo.addEventListener('ended', () => {
    setTimeout(() => {
      flyVideo.currentTime = 0;
      flyVideo.play().catch(() => {});
    }, 3000);
  });
}

// ===== Nav: smooth scroll to sections + highlight the section you're in =====
const SECTION_IDS = ['hero', 'sports', 'food', 'itinerary', 'team', 'disclaimer'];
const navAnchors = Array.from(document.querySelectorAll('.nav-links a, .mobile-menu-links a'));
let sectionTops = {};
let navScrolling = false;

// Sticky sections report their "stuck" position, so measure each one as if it were
// in normal flow to get the scroll position where it actually starts.
function naturalTop(el) {
  const inline = el.style.position;
  el.style.position = 'relative';
  const top = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = inline;
  return Math.round(top);
}

function measureSections() {
  sectionTops = {};
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionTops[id] = naturalTop(el);
  });
}

function scrollTargetFor(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const top = sectionTops[id] ?? naturalTop(el);
  // desktop food scene: land at the end of the Iron Man fly-in, where the menu is fully shown
  if (id === 'food' && !isPhone && flyIronman) return top + el.offsetHeight - window.innerHeight;
  return top;
}

function setActiveNav(id) {
  navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
}

function updateActiveNav() {
  if (navScrolling) return;
  const probe = window.scrollY + window.innerHeight * 0.45;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  let current = SECTION_IDS[0];
  SECTION_IDS.forEach((id) => {
    if (sectionTops[id] !== undefined && sectionTops[id] <= probe) current = id;
  });
  if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1];
  setActiveNav(current);
}

function goToSection(id) {
  const target = scrollTargetFor(id);
  if (target === null) return;
  setActiveNav(id);

  if (window.gsap && window.ScrollToPlugin) {
    const distance = Math.abs(window.scrollY - target);
    navScrolling = true;
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration: Math.min(1.6, Math.max(0.7, distance / 2600)),
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => { navScrolling = false; updateActiveNav(); },
      onInterrupt: () => { navScrolling = false; },
    });
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}

// every in-page link (nav, mobile menu, hero buttons, footer) goes through the same smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    if (!document.getElementById(id)) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    goToSection(id);
  });
});

measureSections();
updateActiveNav();
window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', () => { measureSections(); updateActiveNav(); });
window.addEventListener('load', () => { measureSections(); updateActiveNav(); });

// ===== Reveal on scroll for the itinerary, squad, rules and footer =====
if (window.gsap && window.ScrollTrigger) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = gsap.utils.toArray('.reveal');

  if (!reduceMotion && reveals.length) {
    gsap.set(reveals, { opacity: 0, y: 40 });
    ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, overwrite: true }),
    });
  }

  // the timeline line fills in red as you scroll, and each stop lights up as the line reaches it
  const timelineProgress = document.getElementById('timelineProgress');
  if (timelineProgress) {
    gsap.to(timelineProgress, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
    });
    gsap.utils.toArray('.timeline-item').forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        onEnter: () => item.classList.add('is-lit'),
        onLeaveBack: () => item.classList.remove('is-lit'),
      });
    });
  }
}
