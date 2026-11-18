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

// Lite mode (set in <head>): low-end device / Data Saver / reduced motion -> skip the heavy extras
const LITE = document.documentElement.classList.contains('lite');

// ===== Smooth scrolling (Lenis, driven by the GSAP ticker so ScrollTrigger stays in sync) =====
// Wheel/trackpad scrolling glides to a stop; touch keeps native momentum. Lite devices use native scroll.
let lenis = null;
if (
  !LITE &&
  window.Lenis &&
  window.gsap &&
  window.ScrollTrigger &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
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
  if (lenis) (open ? lenis.stop() : lenis.start());

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
    gsap.set(slides[1], { opacity: 1, x: isCompact() ? -W() * 0.07 : 0 });
  } else {
    const n = slides.length;
    const HOLD = 2.2; // seconds each hero stays sharp
    const SWAP = 0.85; // seconds for the rack-focus swap

    // desktop: sharp hero rests at right: 30px, blurred one slides to right: -20%
    // compact: sharp hero sits a little left of center, blurred one bleeds off the right edge
    const focusX = () => (isCompact() ? -W() * 0.07 : 0);
    const fgX = () => (isCompact() ? W() * 0.31 : W() * 0.2 + 30);
    const exitX = () => fgX() + W() * (isCompact() ? 0.6 : 0.35);

    // lite devices: no animated blur (the most expensive part of the swap); depth comes from opacity + scale
    const F = (full, lite) => (LITE ? lite : full);
    const FOCUS = { x: focusX, scale: 1, opacity: 1, filter: F('blur(0px) brightness(1)', 'none') };
    // smaller screens get a lighter blur and brightness drop so the foreground hero stays visible
    const FOREGROUND = {
      x: fgX,
      scale: 1.1,
      opacity: F(1, 0.55),
      filter: F(() => (isCompact() ? 'blur(7px) brightness(0.92)' : 'blur(12px) brightness(0.8)'), 'none'),
    };
    const EXIT = { x: exitX, scale: 1.3, opacity: 0, filter: F('blur(22px) brightness(0.7)', 'none') };
    // where a new hero starts: tucked behind the focused one, smaller and out of focus
    const BEHIND = { x: () => focusX() - W() * 0.05, scale: 0.88, opacity: 0, filter: F('blur(14px) brightness(0.6)', 'none') };

    gsap.set(slides, { ...BEHIND, zIndex: 0 });

    // opening scene already has both heroes: Iron Man in sharp focus, Spider-Man blurred
    // in the foreground (slide 0), so the rack-focus look is visible from the first second
    let focusIndex = 1;
    let fgIndex = 0;

    gsap.set(slides[fgIndex], { zIndex: 3 });
    gsap.fromTo(
      slides[fgIndex],
      { x: () => fgX() + W() * 0.18, scale: 1.3, opacity: 0, filter: F('blur(22px) brightness(0.7)', 'none') },
      { ...FOREGROUND, duration: 1.2, ease: 'power3.out', delay: 0.25 }
    );
    // Iron Man emerges from behind into focus
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

    if (tab.classList.contains('active')) return;

    sportTabs.forEach((t) => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    sportBlocks.forEach((block) => {
      block.classList.toggle('is-active', block.id === target);
    });

    // cards rise in one after another, VS badges pop
    const next = document.getElementById(target);
    if (next && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.killTweensOf(next.querySelectorAll('.team-card, .vs-badge, .coming-soon'));
      gsap.fromTo(next.querySelectorAll('.team-card, .coming-soon'),
        { y: 36, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,opacity' });
      gsap.fromTo(next.querySelectorAll('.vs-badge'),
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.07, delay: 0.15, clearProps: 'transform' });
    }
  });
});

// ===== Fly transition (Iron Man flies right-to-left into Food) =====
const flyIronman = document.getElementById('flyIronman');
const flyIronmanTrail = document.getElementById('flyIronmanTrail');
const foodReveal = document.getElementById('foodReveal');
const flyGlow = document.querySelector('.fly-glow');
const flyFlash = document.getElementById('flyFlash');
const flyBg = document.getElementById('flyBg');
const flyImage = document.getElementById('flyImage');

const isPhone = window.matchMedia('(max-width: 760px)').matches;

if (!isPhone && flyIronman && foodReveal && window.gsap && window.ScrollTrigger) {
  // anchor Iron Man (and his trail ghost) on their own center
  gsap.set([flyIronman, flyIronmanTrail].filter(Boolean), { xPercent: -50, yPercent: -50 });

  // the flight happens while the food section slides up over the Arena: he crosses the middle
  // when the section's top edge is around half-way up the screen, and is gone by the time it covers it
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#food',
      start: 'top 92%',
      end: 'top 6%',
      scrub: 0.6,
    },
  });

  // he flies through the lower (food) part of the screen, drifting up as the section rises
  gsap.set(flyIronman, { autoAlpha: 0 });
  tl.set(flyIronman, { autoAlpha: 1 }, 0.001);

  // leg 1: swoops in from far right, banked, rising, with a squash as he "catches air"
  tl.fromTo(
    flyIronman,
    { x: '150vw', y: '24vh', rotate: -12, scaleX: 0.8, scaleY: 0.98 },
    { x: '8vw', y: '15vh', rotate: 0, scaleX: 1.08, scaleY: 1.08, ease: 'power3.out', duration: 0.48 },
    0
  )
    // leg 2: banks the other way and stretches/accelerates off-screen, selling raw speed
    .to(
      flyIronman,
      { x: '-62vw', y: '6vh', rotate: 8, scaleX: 1.32, scaleY: 0.82, ease: 'power4.in', duration: 0.52 },
      0.48
    )
    .set(flyIronman, { autoAlpha: 0 }, 1)
    // the food panel trails in behind him, slightly delayed, coming into focus as it lands
    .fromTo(
      foodReveal,
      { x: '60vw', y: '14px', opacity: 0, scale: 0.96, filter: 'blur(14px)' },
      { x: '0vw', y: '0px', opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power3.out', duration: 0.62 },
      0.3
    );

  // a motion-blur ghost that lags slightly behind him, same path, offset in time
  if (flyIronmanTrail) {
    gsap.set(flyIronmanTrail, { visibility: 'visible' });
    tl.fromTo(
      flyIronmanTrail,
      { x: '150vw', y: '24vh', rotate: -12, scaleX: 0.8, scaleY: 0.98, opacity: 0 },
      { x: '8vw', y: '15vh', rotate: 0, scaleX: 1.08, scaleY: 1.08, opacity: 0.4, ease: 'power3.out', duration: 0.48 },
      0.045
    ).to(
      flyIronmanTrail,
      { x: '-62vw', y: '6vh', rotate: 8, scaleX: 1.32, scaleY: 0.82, opacity: 0, ease: 'power4.in', duration: 0.52 },
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

// ===== Food backdrop: Marvel image un-blurs and settles as the section scrolls in =====
// Both blur levels are baked into the images (food-marvel-bg.webp = light blur,
// food-marvel-bg-blur.webp = heavy blur). Scrolling just fades the heavy one out and
// zooms both out: opacity + scale only, which the GPU handles cheaply on any device.
const flyImageBlur = document.getElementById('flyImageBlur');
if (flyImage && window.gsap && window.ScrollTrigger) {
  const layers = [flyImage, flyImageBlur].filter(Boolean);
  if (LITE) {
    gsap.set(layers, { scale: 1.03 });
    if (flyImageBlur) gsap.set(flyImageBlur, { opacity: 0 });
  } else {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#food',
        start: 'top bottom',
        // desktop/tablet: keeps settling through the pinned part; phone: done once it reaches the top
        end: isPhone ? 'top top' : 'bottom bottom',
        scrub: 0.8,
      },
    });
    tl.fromTo(layers, { scale: 1.25 }, { scale: 1.03, ease: 'none' }, 0);
    if (flyImageBlur) tl.fromTo(flyImageBlur, { opacity: 1 }, { opacity: 0, ease: 'power1.in' }, 0);
  }
}

// ===== Pause looping animations while their section is off screen =====
// (spinning portal, mandala, breathing hero, pulsing dots…) so the device only animates what you see
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('anim-paused', !e.isIntersecting)),
    { rootMargin: '100px 0px' }
  );
  document.querySelectorAll('#hero, #sports, #itinerary, #food').forEach((el) => io.observe(el));

  // hero video: only decode frames while the hero is visible
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      });
    }).observe(heroVideo);
  }
}

// Hero video is attached only after the page has painted (poster shows instantly), and never on
// lite devices, which keep the blurred poster frame and skip the 600 KB download completely
{
  const v = document.querySelector('.hero-video');
  if (v && !LITE) {
    v.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; });
    v.load();
    v.play().catch(() => {});
  }
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

  if (lenis) {
    const distance = Math.abs(window.scrollY - target);
    navScrolling = true;
    lenis.scrollTo(target, {
      duration: Math.min(1.8, Math.max(0.9, distance / 2400)),
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      lock: true,
      onComplete: () => { navScrolling = false; updateActiveNav(); },
    });
  } else if (window.gsap && window.ScrollToPlugin) {
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

// ===== Squad players: render 33 cards, show 12 first, rest on "show more" =====
(function () {
  const grid = document.getElementById('playerGrid');
  const btn = document.getElementById('playerMore');
  if (!grid || !btn) return;
  const TOTAL = 33, INITIAL = 12;
  const imgs = ['spider-man.webp', 'hulk.webp', 'thor.webp', 'black-widow.webp', 'captain-america.webp', 'iron-man.webp'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < TOTAL; i++) {
    const card = document.createElement('article');
    card.className = 'squad-card';
    if (i >= INITIAL) card.hidden = true;
    card.innerHTML =
      '<img src="assets/images/hero-carousel/' + imgs[i % imgs.length] + '" alt="" loading="lazy">' +
      '<div class="squad-info"><span class="squad-role">Player</span>' +
      '<h3 class="squad-name">Player ' + String(i + 1).padStart(2, '0') + '</h3>' +
      '<p class="squad-alias">Player name coming soon</p></div>';
    frag.appendChild(card);
  }
  grid.appendChild(frag);
  btn.addEventListener('click', () => {
    grid.querySelectorAll('.squad-card[hidden]').forEach((c) => { c.hidden = false; });
    btn.parentElement.hidden = true;
    btn.setAttribute('aria-expanded', 'true');
  });
})();

// ===== Itinerary: pinned horizontal "mission reel" =====
// Desktop/tablet: the section pins and vertical scroll drives the cards sideways; the
// mission clock, counter, progress rail and the glowing "active" card all follow along.
// Phone: the same cards stack vertically and light up as they pass the middle of the screen.
// (Created before the reveal triggers below, so those account for the pin's extra scroll space.)
(function () {
  const section = document.getElementById('itinerary');
  const track = document.getElementById('itinTrack');
  if (!section || !track || !window.gsap || !window.ScrollTrigger) return;

  const cards = gsap.utils.toArray('.mission-card', track);
  const stops = gsap.utils.toArray('.rail-stop', section);
  const clock = document.getElementById('itinClock');
  const count = document.getElementById('itinCount');
  const fill = document.getElementById('itinRailFill');
  const ghost = document.getElementById('itinGhost');
  let current = -1;

  function setCurrent(i) {
    if (i === current || !cards[i]) return;
    current = i;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    stops.forEach((s, k) => {
      s.classList.toggle('is-past', k < i);
      s.classList.toggle('is-current', k === i);
    });
    if (count) count.textContent = String(i + 1).padStart(2, '0');
    // Eye of Agamotto ring pulses each time the clock jumps to a new stop
    const eye = clock && clock.closest('.itin-clock');
    if (eye) {
      eye.classList.remove('is-turning');
      void eye.offsetWidth; // restart the CSS animation
      eye.classList.add('is-turning');
    }
    if (clock) {
      clock.textContent = cards[i].dataset.time;
      gsap.fromTo(clock, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
    }
  }

  const mm = gsap.matchMedia();
  mm.add(
    // (matchMedia only runs this when at least one query matches, so phone needs its own)
    { wide: '(min-width: 761px)', narrow: '(max-width: 760px)', reduce: '(prefers-reduced-motion: reduce)' },
    (ctx) => {
      const { wide, reduce } = ctx.conditions;
      current = -1;

      if (wide) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const indexAt = (p) => Math.round(p * (cards.length - 1));
        // a little skew while the reel is moving fast, settling back when you stop
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'itinPin',
            trigger: section,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setCurrent(indexAt(self.progress));
              if (!reduce && !LITE) skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -450));
            },
            onRefresh: (self) => setCurrent(indexAt(self.progress)),
          },
        });
        tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
        if (fill) tl.to(fill, { scaleX: 1, ease: 'none' }, 0);
        if (ghost) tl.to(ghost, { xPercent: -30, ease: 'none' }, 0);
        // the Time Stone mandala turns as you move through the day (on top of its slow idle spin)
        const mandala = document.getElementById('itinMandala');
        if (mandala && !reduce) {
          gsap.set(mandala, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
          tl.fromTo(mandala, { rotate: 0 }, { rotate: 220, ease: 'none' }, 0);
        }

        // cards rise into the reel one after another as the section arrives
        if (!reduce) {
          gsap.from(cards, {
            y: '65vh',
            rotate: 6,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.07,
            clearProps: 'transform',
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' },
          });
        }
        setCurrent(0);
      } else {
        cards.forEach((card, k) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 60%',
            end: 'bottom 40%',
            onToggle: (self) => self.isActive && setCurrent(k),
          });
          if (!reduce) {
            gsap.from(card, {
              y: 60,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            });
          }
        });
      }
    }
  );
})();

// ===== Time Stone environment: scene above turns green as the Itinerary arrives; navbar follows =====
if (window.gsap && window.ScrollTrigger && document.getElementById('itinerary')) {
  const flyTint = document.getElementById('flyTint');
  if (flyTint) {
    gsap.to(flyTint, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: '#itinerary', start: 'top bottom', end: 'top top', scrub: true },
    });
  }
  // navbar switches theme as soon as the Itinerary reaches it, and back when it leaves
  ScrollTrigger.create({
    trigger: '#itinerary',
    start: () => 'top ' + (navbar.offsetHeight || 70),
    // when the section is pinned, its "bottom" only arrives after the whole sideways reel
    end: () => {
      const pin = ScrollTrigger.getById('itinPin');
      const navH = navbar.offsetHeight || 70;
      return pin ? pin.end + document.getElementById('itinerary').offsetHeight - navH : 'bottom ' + navH;
    },
    toggleClass: { targets: navbar, className: 'nav--timestone' },
    invalidateOnRefresh: true,
  });
}

// ===== Reveal on scroll for the squad, rules and footer =====
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
}

// section tops shift once the itinerary pin adds its scroll space, so re-measure for the nav
if (window.ScrollTrigger) {
  ScrollTrigger.addEventListener('refresh', () => { measureSections(); updateActiveNav(); });
}

// ===== Pause sections that are covered by the next one =====
// Hero, Arena and Food are sticky, so the browser still counts them as on screen while the next
// section sits on top of them. Once a section is fully covered, its loops (and the hero video) stop.
if (window.gsap && window.ScrollTrigger) {
  const heroVideo = document.querySelector('.hero-video');
  [
    ['hero', 'sports'],
    ['sports', 'food'],
    ['food', 'itinerary'],
    ['itinerary', 'team'],
  ].forEach(([coveredId, coverId]) => {
    const covered = document.getElementById(coveredId);
    const cover = document.getElementById(coverId);
    if (!covered || !cover) return;
    ScrollTrigger.create({
      trigger: cover,
      start: 'top top',
      end: 'max',
      onToggle: (self) => {
        covered.classList.toggle('anim-covered', self.isActive);
        if (covered.id === 'hero' && heroVideo && heroVideo.currentSrc) {
          if (self.isActive) heroVideo.pause();
          else heroVideo.play().catch(() => {});
        }
      },
    });
  });
}
