// ===== Vehicle allocation page =====
// Data from "Red Team Vehicle Allocation November 2026" (assets/docs/vehicle-allocation.pdf).
// Each vehicle is an Avengers squad. `lead` lists the seat numbers highlighted in the PDF.
// Rider rows: [name, designation, phone, pickup point]

const SQUADS = [
  {
    vehicle: 1, seats: 10, plate: 'DM-CHA-12-2379',
    driver: { name: 'Mr. Saddam', phone: '01766657569' },
    squad: 'Stark Squad', hero: 'Iron Man', tagline: 'Genius, billionaire, early pickup.',
    img: 'assets/images/hero-carousel/iron-man.webp', accent: '#ff4a3d', accent2: '#ffc04d',
    lead: [3],
    riders: [
      ['Mahin Sultan', 'Head Of QA', '01730045181', 'Motijheel Shapla Chattar'],
      ['Mirza Edrisur Rahman', 'Procurement Executive', '01730045156', 'Khilgaon Police Fari'],
      ['Samim Hossain', 'Sr. Executive - Accounts', '01730045238', 'Khilgaon Police Fari'],
      ['Md. Shahiduzzaman', 'Merchandiser', '01730045172', 'Malibag Railgate More'],
      ['Shahani Chowdhury', 'Designer', '01730045129', 'Rampura Bridge'],
      ['Progga Paromita Saha', 'Junior Civil Engineer', '01842363982', 'Rampura Bridge'],
      ['Din Mohammed Reza', 'Software Developer', '01812328926', 'Uttar Badda Post Office'],
      ['Sweety Akter', 'Head of Product Technician', '01759618164', 'Jamuna Future Park'],
      ['Nowfel Abu Eusuf', 'Manager - Business Intelligence', '01711708888', 'Jamuna Future Park'],
      ['Md. Abdul Muquith Khan', 'Merchandiser', '01730045233', 'ECB'],
    ],
  },
  {
    vehicle: 2, seats: 10, plate: 'DM-CHA-14-5392',
    driver: { name: 'Mr. Ruhul', phone: '01914676217' },
    squad: 'Shield Squad', hero: 'Captain America', tagline: 'On your left — and on time.',
    img: 'assets/images/hero-carousel/captain-america.webp', accent: '#3d7bff', accent2: '#ff4a55',
    lead: [1],
    riders: [
      ['Sakib Hossain', 'Junior IT Executive', '01932454510', 'Nadda Bus Stand'],
      ['Md. Shehanul Islam', 'Executive - Commercial', '01685090935', 'Le-Meridian'],
      ['Md. Tareq Hasan', 'Senior Merchandiser Traceability', '01730045152', 'Zamzam Tower'],
      ['Shakil Sikder', 'Senior Auditor Traceability', '01743959562', 'Zamzam Tower'],
      ['Sonya Akter', 'Merchandiser', '01739933386', 'Moilar Mor'],
      ['Md. Jahangir Hossain', 'Manager - Merchandising', '01730045146', '12/13 More'],
      ['Marjan Mostafiz Sneha', 'Management Assistant', '01730045200', 'Metro Rail Uttara North'],
      ['Jannatul Ferdous Itishaa', 'Trainee Merchandiser', '01730045166', 'Metro Rail Uttara North'],
      ['Anik Kumar Saha', 'Merchandiser', '01730045350', 'Ponchoboti'],
      ['Rakibul Hasan Rony', 'Designer', '01730045195', 'Ponchoboti'],
    ],
  },
  {
    vehicle: 3, seats: 10, plate: 'DM-CHA-14-5270',
    driver: { name: 'Mr. Arif', phone: '01938383522' },
    squad: 'Asgard Squad', hero: 'Thor', tagline: 'Bring me… the pickup point.',
    img: 'assets/images/hero-carousel/thor.webp', accent: '#4fc3ff', accent2: '#c9d6ff',
    lead: [8],
    riders: [
      ['Muhammad Abdul Wahid', 'Director', '01730045115', ''],
      ['Hadiuzzaman', 'Sr. Software Developer', '01730045193', 'Dhaka University'],
      ['K M Shaberul Islam', 'Data Analyst', '01711900979', 'Dhanmondi 32'],
      ['Shahnaz Akter Jui', 'Merchandiser', '01730035353', 'Dhanmondi 32'],
      ['Tanzim Tabassum', 'Trainee Merchandiser', '01730045157', 'Bata Signal'],
      ['Md. Asiful Mowla', 'Senior Business Intelligence Analyst', '01730045202', 'Asad Gate'],
      ['Ujjal Chandra Sarker', 'Electrical Engineer', '01730045218', 'Mirpur 1 Chinese'],
      ['Shohana Parvin Sraboni', 'Admin Executive', '01730045170', 'Shewrapara'],
      ['Upoma Roy', 'Designer', '01975575286', 'Kazipara'],
      ['Shifat Haque', 'Merchandiser', '01906108957', 'Kazipara'],
    ],
  },
  {
    vehicle: 4, seats: 7, plate: 'DM-CHA-14-6187',
    driver: { name: 'Mr. Mintu', phone: '01721611299' },
    squad: 'Web Squad', hero: 'Spider-Man', tagline: 'Friendly neighbourhood Mirpur crew.',
    img: 'assets/images/hero-carousel/spider-man.webp', accent: '#ff2d4a', accent2: '#3d6bff',
    lead: [1],
    riders: [
      ['Aulad Hossain Roney', 'Senior Merchandiser', '01730045263', 'Mirpur 11'],
      ['Sajidur Rahman', 'Management Assistant - Accounts', '01730045221', 'Mirpur 10'],
      ['Farzana Rahman', 'IT Executive', '01730045279', 'Mirpur 11'],
      ['Mehedi Hasan Rajon', 'Asst. Manager Commercial', '01730045206', 'Mirpur 11'],
      ['Nazmul Huda', 'Executive Commercial', '01730045159', 'Mirpur 11'],
      ['Emamul Mottakin', 'Front End Web Developer', '01730045271', 'Mirpur 11'],
      ['Arif Hossain', 'Business Intelligence Analyst', '01766095106', 'Mirpur 11'],
    ],
  },
  {
    vehicle: 5, seats: 4, plate: 'To be confirmed',
    driver: { name: 'To be confirmed', phone: '' },
    squad: 'Red Room Squad', hero: 'Black Widow', tagline: 'Small team. Zero missed pickups.',
    img: 'assets/images/hero-carousel/black-widow.webp', accent: '#ff3b3b', accent2: '#ffb199',
    lead: [2],
    riders: [
      ['Dipu Salauddin', 'Executive Director', '01730045108', 'Jasimuddin'],
      ['Md. Shohag Mia', 'Assistant Manager - Sample Section', '01730045167', 'Jasimuddin'],
      ['Nuha Samirah Zaman', 'Management Executive', '01730045155', 'Jasimuddin'],
      ['Mehedi Hasan Ratul', 'Wash Technician', '01717255597', 'Nikunjo'],
    ],
  },
  {
    vehicle: 6, seats: 4, plate: 'Rented Car',
    driver: { name: 'Rented Car', phone: '' },
    squad: 'Wakanda Squad', hero: 'Black Panther', tagline: 'Wakanda forever — from 14 No.',
    img: 'assets/images/heroes/black-panther.webp', accent: '#a46bff', accent2: '#d8c2ff',
    lead: [2],
    riders: [
      ['Sayeed Ahmed', 'Director', '01730045283', '14 No.'],
      ['Md. Golam Mustafa Bhuiyan Dipu', 'GM-Commercial', '01977045240', '14 No.'],
      ['Md. Arifur Rahman', 'Executive Commercial', '01730045357', '14 No.'],
      ['Iqbal Hossain', 'Driver', '01736091285', '14 No.'],
    ],
  },
  {
    vehicle: 7, seats: 40, plate: 'To be confirmed',
    driver: { name: 'To be confirmed', phone: '' },
    squad: 'Smash Bus', hero: 'Hulk', tagline: 'The big green 40-seater. Everyone from ITL Office.',
    img: 'assets/images/hero-carousel/hulk.webp', accent: '#5ee05a', accent2: '#b6ff8a',
    lead: [12], wide: true,
    riders: [
      ['Mr. Mukti', 'Referee', '01711321257', 'ITL Office'],
      ['Mr. Ariful Islam', 'Umpire', '01675830308', 'ITL Office'],
      ['Manirul Haque', 'AGM Accounts', '01730045355', 'ITL Office'],
      ['Goutam Ghosh', 'AGM Taxation', '01766494283', 'ITL Office'],
      ['Tashdeed Noor', 'Manager - Sustainability and Compliance', '01730045243', 'ITL Office'],
      ['Shakhawat Hossain Sabbir', 'Senior Merchandiser', '01730045164', 'ITL Office'],
      ['Sheikh Sultan Ahmed', 'Assistant Manager - IT', '01730045209', 'ITL Office'],
      ['Abdullah Al Mhmud', 'Senior Architect', '01730045154', 'ITL Office'],
      ['Muhammad Al Hasan', 'Sr Executive Accounts', '01730045228', 'ITL Office'],
      ['Khan Al-Mamun', 'Management Assistant - Group Admin', '01730045235', 'ITL Office'],
      ['Shaidul Islam', 'Office Executive', '01730045191', 'ITL Office'],
      ['Nayeem Islam', 'Office Executive', '01730045352', 'ITL Office'],
      ['Khandaker Mostafijul Haque (Hamim)', 'Assistant Manager QA', '01716246154', 'ITL Office'],
      ['Md. Bashir Ahamed', 'Product Safety Coordinator', '01730045246', 'ITL Office'],
      ['Md. Mohe Uddin', 'Junior Admin Executive', '01730045132', 'ITL Office'],
      ['Abu Hanif', 'Executive Trainee', '01730045249', 'ITL Office'],
      ['Shuvo Kormokar', 'Q.C Officer', '01985689852', 'ITL Office'],
      ['Md. Abu Said', 'Sample Man', '01715768673', 'ITL Office'],
      ['Md. Abul Bashar', 'Sample Man', '01764452094', 'ITL Office'],
      ['Md. Abdul Kader', 'Sample Man', '01744224697', 'ITL Office'],
      ['Md. Sharif', 'Cutting Man', '01902977823', 'ITL Office'],
      ['Md. Meraz', 'Finishing Man', '01612631774', 'ITL Office'],
      ['Monir Hossen Mondal', 'Sample Man', '01856083311', 'ITL Office'],
      ['Md. Ibrahim', 'Sample Man', '01972710396', 'ITL Office'],
      ['Md. Monir Hossain', 'Sample Man', '', 'ITL Office'],
      ['Md. Alamin', 'Sample Man', '', 'ITL Office'],
      ['Md. Marzan', 'Cook', '01624964787', 'ITL Office'],
      ['Md. Saiful', 'Cook', '01884637016', 'ITL Office'],
      ['Nasir Uddin', 'Cook', '01730045143', 'ITL Office'],
      ['Md. Aynal', 'Asst. Cook', '01741507010', 'ITL Office'],
      ['Abdul Mannan', 'Electrician', '01730045289', 'ITL Office'],
      ['Rajkumar Shuthrodhar', 'AC Technician', '01643401826', 'ITL Office'],
      ['Mainuddin', 'Plumber', '01730045298', 'ITL Office'],
      ['Raza Mia', 'Messenger', '01730045388', 'ITL Office'],
      ['Zamir Mia', 'Office Boy', '01982460191', 'ITL Office'],
      ['Babul Hossain', 'Office Boy', '01818405421', 'ITL Office'],
      ['Security', '', '', 'ITL Office'],
      ['Nayem Khan Sakib', 'Cleaner', '01629805495', 'ITL Office'],
      ['Saiful Islam', 'Cleaner', '01930114744', 'ITL Office'],
      ['Masud Kabir Real', 'Trainee Q. A. Officer', '01644886624', 'ITL Office'],
    ],
  },
  {
    vehicle: null, seats: null, plate: 'Own arrangement',
    driver: null,
    squad: 'Portal Travellers', hero: 'Doctor Strange', tagline: 'Personal vehicle / own arrangement — open your own portal to the venue.',
    img: 'assets/images/arena/doctor-strange.webp', accent: '#3dff8a', accent2: '#ffb347',
    lead: [], wide: true, own: true,
    riders: [
      ['Kabir Ahmed', 'Executive Director', '01730045134', ''],
      ['Sadman Hossain Ayon', 'Intern', '01942949899', ''],
      ['Sana Ullah', 'Imam', '01818374791', ''],
      ['Kabir Hossain', 'Assistant Manager QA', '01718774222', ''],
      ['Motaleb Hossain Dablu', 'Assistant Manager QA', '01730045133', ''],
      ['Ariful Haque', 'Fabric Technician', '01721260333', ''],
      ['Hasanuzzaman Hirok', 'Wash Technician', '01722531091', ''],
      ['Md. Apon Shah Rana', 'Q. A. Officer', '01743587938', ''],
      ['Aufin Kawser', 'Q. A. Officer', '01711349221', ''],
      ['Md Ziaur Rahman', 'Q. A. Officer', '016866911757', ''],
      ['Md. Abdur Zaher', 'Q. A. Officer', '01537680544', ''],
      ['Md. Abu Sayem', 'Q. A. Officer', '01341581743', ''],
      ['Md. Johirul Haq', 'Q. A. Officer', '01758347104', ''],
      ['Md. Nurul Islam', 'Q. A. Officer', '01711132652', ''],
      ['Md. Sohel Rana', 'Q. A. Officer', '01716733149', ''],
      ['Md. Zamrul Islam Parvez', 'Q. A. Officer', '01608912171', ''],
      ['Swapan Adhikari', 'Pattern Master', '01922766757', ''],
      ['Md. Masum Mia', 'Finishing Man', '', ''],
      ['SM Bacchu', 'Personal Security', '01609412070', ''],
      ['Md. Kawser/Abdur Rahim Talukder', 'Driver', '01730045145', ''],
    ],
  },
];

// ---------- rendering ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
// Bangladesh mobile numbers in international form, so tapping "call" dials correctly on any phone:
// 01730045181 -> tel:+8801730045181
function telHref(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('01')) return 'tel:+880' + digits.slice(1);
  return 'tel:' + digits;
}

const ICON_PHONE = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5"/></svg>';
const ICON_STAR = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';

function riderRow(r, i, squad) {
  const [name, role, phone, pickup] = r;
  const seat = i + 1;
  const isLead = squad.lead.includes(seat);
  const search = [name, role, phone, pickup].join(' ').toLowerCase();
  return `<li class="vx-rider${isLead ? ' is-lead' : ''}" data-search="${esc(search)}">
      <span class="vx-seat">${pad(seat)}</span>
      <span class="vx-who">
        <span class="vx-name">${esc(name)}${isLead ? ` <span class="vx-lead">${ICON_STAR}Squad Lead</span>` : ''}</span>
        ${role ? `<span class="vx-role">${esc(role)}</span>` : ''}
      </span>
      ${squad.own ? '' : `<span class="vx-pickup">${ICON_PIN}${esc(pickup || 'TBA')}</span>`}
      ${phone ? `<a class="vx-call" href="${telHref(phone)}" aria-label="Call ${esc(name)}">${ICON_PHONE}<span>${esc(phone)}</span></a>` : '<span class="vx-call vx-call--none"></span>'}
    </li>`;
}

function squadCard(s, index) {
  const filled = s.riders.length;
  const pct = s.seats ? Math.min(100, (filled / s.seats) * 100) : 100;
  const label = s.vehicle ? `Vehicle ${pad(s.vehicle)}` : 'Own Arrangement';
  const driver = s.driver && s.driver.phone
    ? `<a class="vx-driver" href="${telHref(s.driver.phone)}" aria-label="Call driver ${esc(s.driver.name)}">${ICON_PHONE}<span><small>Driver</small>${esc(s.driver.name)} &middot; ${esc(s.driver.phone)}</span></a>`
    : s.driver
      ? `<span class="vx-driver vx-driver--none"><span><small>Driver</small>${esc(s.driver.name)}</span></span>`
      : '';
  return `<article class="vx-card${s.wide ? ' vx-card--wide' : ''}${s.own ? ' vx-card--own' : ''}" style="--accent:${s.accent};--accent2:${s.accent2}" data-squad="${index}">
    <header class="vx-card-head">
      <div class="vx-card-bg" aria-hidden="true"></div>
      <span class="vx-card-num" aria-hidden="true">${s.vehicle ? pad(s.vehicle) : '∞'}</span>
      <img class="vx-card-hero" src="${esc(s.img)}" alt="${esc(s.hero)}" loading="lazy">
      <div class="vx-card-info">
        <p class="vx-card-label">${label}${s.seats ? ` &bull; ${s.seats} Seats` : ''}</p>
        <h2 class="vx-card-title">${esc(s.squad)}</h2>
        <p class="vx-card-hero-name">Led by the spirit of ${esc(s.hero)}</p>
        <p class="vx-card-tagline">${esc(s.tagline)}</p>
        <div class="vx-card-meta">
          <span class="vx-plate">${esc(s.plate)}</span>
          ${driver}
        </div>
        <div class="vx-meter" aria-label="${filled} riders">
          <span class="vx-meter-bar"><span style="width:${pct}%"></span></span>
          <span class="vx-meter-text">${filled}${s.seats ? ` / ${s.seats}` : ''} riders</span>
        </div>
      </div>
    </header>
    <ol class="vx-riders">${s.riders.map((r, i) => riderRow(r, i, s)).join('')}</ol>
  </article>`;
}

const grid = document.getElementById('vxGrid');
grid.innerHTML = SQUADS.map(squadCard).join('');

// stats
const vehicles = SQUADS.filter((s) => s.vehicle).length;
const riding = SQUADS.filter((s) => s.vehicle).reduce((n, s) => n + s.riders.length, 0);
const own = SQUADS.filter((s) => s.own).reduce((n, s) => n + s.riders.length, 0);
document.getElementById('vxStats').innerHTML = [
  [vehicles, 'Squads on wheels'],
  [riding, 'Heroes riding'],
  [own, 'Own arrangement'],
].map(([n, l]) => `<div class="vx-stat"><b>${n}</b><span>${l}</span></div>`).join('');

// ---------- search ----------
const search = document.getElementById('vxSearch');
const count = document.getElementById('vxSearchCount');
const empty = document.getElementById('vxEmpty');
const cards = Array.from(grid.querySelectorAll('.vx-card'));

function applySearch() {
  const q = search.value.trim().toLowerCase();
  let hits = 0;
  cards.forEach((card) => {
    let cardHits = 0;
    card.querySelectorAll('.vx-rider').forEach((row) => {
      const match = !q || row.dataset.search.includes(q);
      row.hidden = !match;
      row.classList.toggle('is-match', !!q && match);
      if (match) cardHits++;
    });
    card.hidden = !!q && cardHits === 0;
    hits += q ? cardHits : 0;
  });
  count.textContent = q ? `${hits} found` : '';
  empty.hidden = !q || hits > 0;
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
search.addEventListener('input', applySearch);

// ---------- navbar + smooth scroll + reveals ----------
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// lite devices (flag set in <head>) get native scrolling and no entrance animations
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('lite');

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis && !reduceMotion) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (!reduceMotion) {
    gsap.from('.vx-hero-inner > *', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.15 });

    // each squad card drives in from the side, its hero leaps up behind it
    cards.forEach((card, i) => {
      const hero = card.querySelector('.vx-card-hero');
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
      tl.from(card, { x: i % 2 ? 80 : -80, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' })
        .from(hero, { y: 60, scale: 0.9, opacity: 0, duration: 0.9, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.2)
        .from(card.querySelectorAll('.vx-rider'), { y: 14, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.025, clearProps: 'transform,opacity' }, 0.35);
    });
  }
}
