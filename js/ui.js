/* ============================================================
   UI COMPARTIDA · config, smooth scroll y menú pastilla
   (se usa en todas las páginas del sitio)
   ============================================================ */
/* ============================================================
   CONFIG
   ============================================================ */
const CONFIG = {
  showAfter: 60,     // px de scroll para que aparezca la pastilla
  scrollLerp: 0.085, // suavidad del smooth scroll
  openWidth: 264,    // ancho de la pastilla desplegada
  boilFps: 9,        // "redibujados" por segundo del garabato
  boilScale: 9,      // fuerza de la deformación del trazo
};

gsap.registerPlugin(CustomEase);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

CustomEase.create('springOut', 'M0,0 C0.16,0 0.24,1.12 0.42,1.05 0.58,0.99 0.7,1 1,1');
CustomEase.create('glassIn',  'M0,0 C0.5,0 0.72,0.02 1,1');

/* Los filtros blur() animados son de lo más caro en GPU móvil:
   se reservan para pantallas grandes; en móvil, opacidad + movimiento */
const BLUR_OK = matchMedia('(min-width:768px)').matches;
const bl = px => BLUR_OK ? `blur(${px}px)` : 'blur(0px)';

/* ============================================================
   SMOOTH SCROLL · lerp + rAF (técnica Lenis)
   ============================================================ */
const wrapper = document.getElementById('smooth-wrapper');
const content = document.getElementById('smooth-content');
let current = 0, target = 0;

if (wrapper){
function setBodyHeight(){ document.body.style.height = content.scrollHeight + 'px'; }
new ResizeObserver(setBodyHeight).observe(content);
setBodyHeight();

if (!reduceMotion){
  let lastY = -1;
  const raf = () => {
    target = window.scrollY;
    current += (target - current) * CONFIG.scrollLerp;
    if (Math.abs(target - current) < 0.05) current = target;
    const y = Math.round(current * 100) / 100;
    if (y !== lastY){ /* evita escrituras (y repintados) innecesarios */
      wrapper.style.transform = `translate3d(0,${-y}px,0)`;
      lastY = y;
    }
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
} else {
  wrapper.style.position = 'static';
  document.body.style.height = 'auto';
}
} /* fin if(wrapper) */

/* ============================================================
   PASTILLA · aparición, morph de apertura y cierre
   ============================================================ */
const dock   = document.getElementById('dock');
const pill   = document.getElementById('pill');
const items  = document.getElementById('items');
const toggle = document.getElementById('toggle');
const links  = items.querySelectorAll('a');
const tMenu  = toggle.querySelector('.t-menu');
const tClose = toggle.querySelector('.t-close');

const PILL_H = 58, PILL_W = 196, PILL_R = 29;
let isOpen = false, isShown = false;

gsap.set(dock, { visibility:'visible', y: 140, opacity: 0 });

function onScroll(){
  const show = window.scrollY > CONFIG.showAfter;
  if (show === isShown) return;
  isShown = show;
  if (show){
    gsap.to(dock, { y:0, opacity:1, duration:.9, ease:'springOut', overwrite:'auto' });
  } else {
    if (isOpen) closeMenu(true);
    gsap.to(dock, { y:140, opacity:0, duration:.5, ease:'glassIn', overwrite:'auto' });
  }
}
if (document.body.dataset.dock === 'always'){
  /* páginas sin scroll vertical (portfolio): la pastilla está siempre */
  gsap.set(dock, { visibility:'visible', y:0, opacity:1 });
  isShown = true;
} else {
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

function openMenu(focusFirst = false){
  if (isOpen) return;
  isOpen = true;
  toggle.setAttribute('aria-expanded','true');

  gsap.set(items, { visibility:'visible' });
  const openH = PILL_H + items.scrollHeight;

  gsap.timeline({ defaults:{ overwrite:'auto' } })
    .to(pill, { height: openH, width: CONFIG.openWidth, borderRadius: 34,
                duration:.75, ease:'springOut' }, 0)
    .fromTo(links,
      { y: 26, opacity: 0, filter:bl(8) },
      { y: 0, opacity: 1, filter:bl(0), duration:.55, ease:'glassIn',
        stagger:{ each:.055, from:'end' } }, .08)
    .to(tMenu,  { y:-12, opacity:0, filter:bl(4), duration:.3, ease:'glassIn' }, 0)
    .fromTo(tClose, { y:12, opacity:0, filter:bl(4) },
                    { y:0, opacity:1, filter:bl(0), duration:.35, ease:'glassIn' }, .12);

  /* el foco solo salta a la primera opción si se abrió con teclado;
     en táctil dejaba "Portfolio" como seleccionado permanentemente */
  if (focusFirst) links[0].focus({ preventScroll:true });
}

function closeMenu(instant = false){
  if (!isOpen) return;
  isOpen = false;
  toggle.setAttribute('aria-expanded','false');

  const d = instant ? 0 : 1;
  gsap.timeline({
      defaults:{ overwrite:'auto' },
      onComplete: () => gsap.set(items, { visibility:'hidden' })
    })
    .to(links, { y:18, opacity:0, filter:bl(6), duration:.28*d, ease:'glassIn',
                 stagger:{ each:.035, from:'start' } }, 0)
    .to(pill,  { height:PILL_H, width:PILL_W, borderRadius:PILL_R,
                 duration:.55*d, ease:'springOut' }, .05*d)
    .to(tClose,{ y:12, opacity:0, filter:bl(4), duration:.25*d, ease:'glassIn' }, 0)
    .to(tMenu, { y:0, opacity:1, filter:bl(0), duration:.3*d, ease:'glassIn' }, .1*d);
}

toggle.addEventListener('click', e =>
  /* e.detail === 0 -> activado con teclado (Enter/Espacio) */
  isOpen ? closeMenu() : openMenu(e.detail === 0)
);

links.forEach(a => a.addEventListener('click', e => {
  const href = a.getAttribute('href');
  if (!href.startsWith('#')){ closeMenu(); return; } /* navegación normal a otra página */
  e.preventDefault();
  const el = document.querySelector(href);
  closeMenu();
  const top = el.getBoundingClientRect().top + current;
  if (reduceMotion) window.scrollTo(0, top);
  else window.scrollTo({ top });
}));

addEventListener('keydown', e => {
  if (e.key === 'Escape' && isOpen){ closeMenu(); toggle.focus(); }
});
document.addEventListener('click', e => {
  if (isOpen && !pill.contains(e.target)) closeMenu();
});

pill.addEventListener('pointerdown', () =>
  gsap.to(pill, { scale:.965, duration:.18, ease:'glassIn' }));
addEventListener('pointerup', () =>
  gsap.to(pill, { scale:1, duration:.6, ease:'springOut' }));
