'use strict';
(() => {
 const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
 function updateMotion() {
  document.documentElement.classList.toggle('motion-paused', preference.matches);
  document.documentElement.classList.toggle('motion-enabled', !preference.matches);
  if (preference.matches) document.querySelector('.hero-vector')?.classList.remove('is-drawing');
  document.dispatchEvent(new Event('site:motionchange'));
 }
 preference.addEventListener('change', updateMotion);
 updateMotion();
 const projects = {"montreal": {"name": "Montreal Metro", "facts": {"Sector": "Trade & transportation", "Location(s)": "Montréal, QC", "Participation": "$62 million", "Partner(s)": "Government of Québec"}}, "toronto": {"name": "Toronto Train", "facts": {"Sector": "Housing", "Location(s)": "Toronto, ON", "Participation": "$98 million", "Partner(s)": "Government of Ontario"}}, "winnipeg": {"name": "Winnipeg Wins", "facts": {"Sector": "Housing", "Location(s)": "TBD", "Participation": "$969 million", "Partner(s)": "Government of Manitoba"}}, "village": {"name": "Le Village Views", "facts": {"Sector": "Healthcare", "Location(s)": "Ottawa, ON", "Participation": "$99 million", "Partner(s)": "Government of Ontario"}}, "plants": {"name": "Plants Places", "facts": {"Sector": "Healthcare", "Location(s)": "Toronto, ON", "Participation": "$269 million", "Partner(s)": "Government of Ontario"}}, "bus": {"name": "Bus Brothers", "facts": {"Sector": "Transportation", "Location(s)": "Vancouver, BC", "Participation": "$69 million", "Partner(s)": "Government of British Columbia"}}};
 document.querySelector('#projectModal')?.addEventListener('show.bs.modal', event => {
  const project = projects[event.relatedTarget?.dataset.project];
  if (!project) return;
  document.querySelector('#projectModalTitle').textContent = project.name;
  document.dispatchEvent(new CustomEvent('site:headingchange', { detail: document.querySelector('#projectModalTitle') }));
  const facts = document.querySelector('#modalFacts'); facts.replaceChildren();
  for (const [label, value] of Object.entries(project.facts)) {
   const group = document.createElement('div');
   const dt = document.createElement('dt'); dt.textContent = label;
   const dd = document.createElement('dd'); dd.textContent = value;
   group.append(dt, dd); facts.append(group);
  }
 });
 document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', () => {
  const nav = document.querySelector('#navigation');
  if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
 }));
})();

// Validate the static preview without transmitting or storing contact information.
const contactForm = document.querySelector('#contactForm');
contactForm?.addEventListener('submit', event => {
 event.preventDefault();
 if (contactForm.reportValidity()) window.location.assign('thank-you.html?demo=1');
});
if (document.querySelector('.confirmation') && new URLSearchParams(window.location.search).has('demo')) {
 document.querySelector('.confirmation h1').textContent = 'Your demo submission is complete.';
 document.querySelector('.confirmation-copy').textContent = 'Your form was validated. No information was sent.';
}

// The draw-on runs once. Afterward, remove the reveal masks entirely.
const heroArtwork = document.querySelector('.hero-vector');
heroArtwork?.querySelector('[data-draw-final]')?.addEventListener('animationend', () => {
 heroArtwork.classList.remove('is-drawing');
}, { once: true });

// Reversible scroll reveals. Progress comes from position, not a one-time trigger.
(() => {
 const root = document.documentElement;
 const selectors = [
  '.prosperity > h2', '.priority-card', '.process-copy', '.steps > li',
  '.projects-heading', '.project-card', '.announcements h2', '.announcements article',
  '.contact-panel', '.about-title-row', '.about-grid > div > section',
  '.about-grid > section > h2', '.about-grid > section > p', '.check-list > li',
  '.leadership h2', '.leader', '.detail-art-slot', '.detail-copy > h1',
  '.detail-copy > p', '.detail-copy > ul', '.detail-copy > section',
  '.funding-card > section', '.wide-art', '.catalog > .project-mark', '.catalog > h1',
  '.contact-form-card', '.confirmation', '.footer-brand', '.footer-nav'
 ];
 const candidates = [...document.querySelectorAll(selectors.join(','))];
 // Animate one layer per piece of content; nested opacity/translation would compound.
 const candidateSet = new Set(candidates);
 const elements = candidates.filter(element => {
  if (element.matches('h1,h2,h3,h4,h5,h6')) return false;
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
   if (candidateSet.has(parent)) return false;
  }
  return true;
 });
 if (!elements.length) return;
 const states = elements.map(element => {
  element.setAttribute('data-scroll-reveal', '');
  return {
   element, progress: 1, offset: 0, stagger: 0,
   distance: element.matches('h1,h2,.wide-art') ? 16 : 24
  };
 });
 for (const group of document.querySelectorAll('.prosperity .row,.related-cards,.leader-grid,.steps,.check-list')) {
  const members = states.filter(state => group.contains(state.element));
  members.forEach((state, index) => {
   // The offset is a short distance in the viewport, never a waiting timer.
   state.stagger = Math.min(index, 3) * 18;
  });
 }
 let frame = 0;
 let previousTime = 0;
 let snapNext = false;
 const clamp = value => Math.min(1, Math.max(0, value));
 function render(now, immediate = false) {
  frame = 0;
  const paused = root.classList.contains('motion-paused');
  const height = window.innerHeight;
  const range = Math.min(190, Math.max(120, height * .2));
  const start = height - 30;
  const blend = immediate || paused ? 1 : 1 - Math.exp(-Math.min(48, now - previousTime) / 75);
  previousTime = now;
  // Read all geometry before writing any styles. Subtract our own translation
  // so the reveal cannot feed back into its next scroll measurement.
  const targets = states.map(state => {
   if (paused || state.element.contains(document.activeElement)) return 1;
   const top = state.element.getBoundingClientRect().top - state.offset;
   return clamp((start - top - state.stagger) / range);
  });
  let settling = false;
  states.forEach((state, index) => {
   const target = targets[index];
   const next = Math.abs(target - state.progress) < .001 ? target : state.progress + (target - state.progress) * blend;
   state.progress = next;
   if (Math.abs(target - next) > .001) settling = true;
   const eased = next * next * (3 - 2 * next);
   const offset = (1 - eased) * state.distance;
   const rounded = Math.round(offset * 100) / 100;
   const opacity = eased.toFixed(4);
   if (state.offset !== rounded || state.opacity !== opacity) {
    state.element.style.setProperty('--reveal-opacity', opacity);
    state.opacity = opacity;
    state.element.style.setProperty('--reveal-y', rounded + 'px');
    state.offset = rounded;
   }
  });
  if (settling) frame = requestAnimationFrame(tick);
 }
 function tick(now) {
  const immediate = snapNext;
  snapNext = false;
  render(now, immediate);
 }
 function schedule(immediate = false) {
  snapNext = snapNext || immediate;
  if (frame) return;
  previousTime = performance.now();
  frame = requestAnimationFrame(tick);
 }
 render(performance.now(), true);
 // Enable styles only after values exist: without JS the site remains visible.
 root.classList.add('reveal-ready');
 window.addEventListener('scroll', () => schedule(), { passive: true });
 window.addEventListener('resize', () => schedule(true), { passive: true });
 window.addEventListener('load', () => schedule(true), { once: true });
 document.addEventListener('focusin', () => schedule(true));
 document.addEventListener('focusout', () => schedule());
 document.addEventListener('site:motionchange', () => schedule(true));
 document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(true); });
 document.fonts?.ready.then(() => schedule(true));
})();

// Word-level heading reveals share the scroll direction of the surrounding content.
(() => {
 const root = document.documentElement;
 const states = new Map();
 const clamp = value => Math.min(1, Math.max(0, value));
 let frame = 0, lastTime = performance.now();
 function prepare(heading, opening = false) {
  if (!heading) return;
  // Walk text nodes so line breaks, emphasis, links and accordion buttons survive.
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
   if (!walker.currentNode.parentElement.closest('.heading-word,svg,script,style')) nodes.push(walker.currentNode);
  }
  for (const node of nodes) {
   const fragment = document.createDocumentFragment();
   for (const token of node.textContent.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
    else {
     const word = document.createElement('span');
     word.className = 'heading-word'; word.textContent = token;
     fragment.append(word);
    }
   }
   node.replaceWith(fragment);
  }
  const rect = heading.getBoundingClientRect();
  const intro = rect.height > 0 && rect.top >= 0 && rect.top < innerHeight - 30;
  states.set(heading, {
   heading, words: [...heading.querySelectorAll('.heading-word')], progress: 0, previous: -1,
   introStart: opening || intro ? performance.now() : null
  });
 }
 function paint(now) {
  frame = 0;
  const reduced = root.classList.contains('motion-paused');
  const blend = 1 - Math.exp(-Math.min(48, now - lastTime) / 75);
  lastTime = now;
  let running = false;
  const range = Math.min(240, Math.max(160, innerHeight * .25));
  const measurements = [...states.values()].map(state => {
   const rect = state.heading.getBoundingClientRect();
   const parent = state.heading.closest('[data-scroll-reveal]');
   const parentOffset = parent ? parseFloat(parent.style.getPropertyValue('--reveal-y')) || 0 : 0;
   const focused = state.heading.contains(document.activeElement);
   let target = rect.height ? clamp((innerHeight - 30 - rect.top + parentOffset) / range) : 0;
   if (state.introStart !== null && !reduced && !focused) {
    const elapsed = clamp((now - state.introStart) / 1100);
    target = Math.min(target, elapsed);
    if (elapsed < 1 && rect.height) running = true;
    else state.introStart = null;
   }
   if (reduced || focused) target = 1;
   return { state, target };
  });
  for (const { state, target } of measurements) {
   const delta = target - state.progress;
   state.progress = reduced || Math.abs(delta) < .001 ? target : state.progress + delta * blend;
   if (Math.abs(target - state.progress) > .001) running = true;
   const rounded = Math.round(state.progress * 1000) / 1000;
   if (rounded === state.previous) continue;
   state.previous = rounded;
   const count = state.words.length;
   const stagger = count > 1 ? .65 : 0;
   state.words.forEach((word, index) => {
    const local = clamp(rounded * (1 + stagger) - (count > 1 ? index / (count - 1) * stagger : 0));
    const eased = local * local * (3 - 2 * local);
    word.style.setProperty('--word-opacity', eased.toFixed(3));
    word.style.setProperty('--word-blur', ((1 - eased) * 6).toFixed(2) + 'px');
    word.style.setProperty('--word-y', ((1 - eased) * .55).toFixed(3) + 'em');
    word.classList.toggle('is-settled', local >= .9999);
   });
  }
  if (running) frame = requestAnimationFrame(paint);
 }
 function schedule() {
  if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(paint); }
 }
 document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(heading => prepare(heading));
 paint(performance.now());
 root.classList.add('words-ready');
 window.addEventListener('scroll', schedule, { passive: true });
 window.addEventListener('resize', schedule, { passive: true });
 window.addEventListener('load', schedule, { once: true });
 document.fonts?.ready.then(schedule);
 document.addEventListener('site:motionchange', schedule);
 document.addEventListener('focusin', schedule);
 document.addEventListener('focusout', schedule);
 document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
 document.addEventListener('site:headingchange', event => { prepare(event.detail, true); schedule(); });
 document.addEventListener('shown.bs.modal', event => {
  event.target.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(heading => prepare(heading, true));
  schedule();
 });
 document.addEventListener('shown.bs.collapse', schedule);
})();
