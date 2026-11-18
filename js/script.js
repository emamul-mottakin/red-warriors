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

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
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
  const isPhoneHero = window.matchMedia('(max-width: 760px)').matches;

  if (isPhoneHero || slides.length < 2) {
    // phones stay simple and stable: just show the first hero, centered, no animation
    gsap.set(slides[0], { opacity: 1, xPercent: -50 });
  } else {
    const n = slides.length;
    const HOLD = 2.2; // seconds each hero stays sharp
    const SWAP = 0.85; // seconds for the rack-focus swap

    // distance from right: 30px to right: -20% of the screen
    const fgX = () => heroCarousel.offsetWidth * 0.2 + 30;
    const exitX = () => fgX() + heroCarousel.offsetWidth * 0.35;

    const FOCUS = { x: 0, scale: 1, opacity: 1, filter: 'blur(0px) brightness(1)' };
    const FOREGROUND = { x: fgX, scale: 1.1, opacity: 1, filter: 'blur(12px) brightness(0.8)' };
    const EXIT = { x: exitX, scale: 1.3, opacity: 0, filter: 'blur(22px) brightness(0.7)' };
    // where a new hero starts: tucked behind the focused one, smaller and out of focus
    const BEHIND = { x: () => -heroCarousel.offsetWidth * 0.05, scale: 0.88, opacity: 0, filter: 'blur(14px) brightness(0.6)' };

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

    // keep the foreground hero pinned to right: -20% when the window is resized
    window.addEventListener('resize', () => {
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
  gsap.registerPlugin(ScrollTrigger);

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
