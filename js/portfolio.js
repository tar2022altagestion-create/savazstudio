/* ============================================================
   PORTFOLIO · trabajos, arrastre con inercia y volteo
   ============================================================ */

/* ------------------------------------------------------------
   TUS TRABAJOS · añade, quita o reordena entradas aquí.
   - titulo: nombre del proyecto
   - desc:   texto corto de la cara trasera
   - img:    ruta de la portada, p.ej. 'assets/img/works/snowblind.jpg'
             (si se deja vacía se muestra un placeholder numerado)
   - enlace: adónde lleva el botón SABER MÁS (de momento '#')
   ------------------------------------------------------------ */
const WORKS = [
  { titulo:'Is God Dead?',              desc: 'Lost in the darkness,<b> I fade from the light.<b> Cause of death: blindness,<b> it\'s there in the night.<b> Una exploración del nihilismo, la crisis de fe y la moral en el tema "God Is Dead?" de Black Sabbath, planteando la espiritualidad individual como resistencia al caos moderno.'

.', img:'assets/img/works/is-god-dead.jpg',         enlace:'#' },
  { titulo:'Snowblind',                 desc:'Cartel para el clásico de Black Sabbath. La estela del avión como línea de coca, blanco sobre azul.', img:'assets/img/works/snowblind.jpg',           enlace:'#' },
  { titulo:'MF DOOM',                   desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/mf-doom.jpg',             enlace:'#' },
  { titulo:"Bed's Too Big Without You", desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/beds-too-big.jpg',        enlace:'#' },
  { titulo:'Savaz Studio',              desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/savaz-studio.jpg',        enlace:'#' },
  { titulo:'Restricted Lane',           desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/restricted-lane.jpg',     enlace:'#' },
  { titulo:'Red Skin',                  desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/red-skin.jpg',            enlace:'#' },
  { titulo:'Black Sabbath Merch',       desc:'Texto provisional — pásame la descripción real de este trabajo y la cambio.', img:'assets/img/works/black-sabbath-merch.jpg', enlace:'#' },
];

const stage = document.getElementById('worksStage');
const track = document.getElementById('worksTrack');

/* ---------- Construcción de las tarjetas ---------- */
WORKS.forEach((w, i) => {
  const el = document.createElement('article');
  el.className = 'work';
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-expanded', 'false');
  el.setAttribute('aria-label', `${w.titulo} — ver detalle`);

  const front = w.img
    ? `<img src="${w.img}" alt="" loading="lazy" decoding="async" draggable="false">`
    : '';

  const backCover = w.img
    ? `<img src="${w.img}" alt="" loading="lazy" decoding="async" draggable="false">`
    : '';

  el.innerHTML = `
    <div class="work-3d">
      <div class="work-front">${front}</div>
      <div class="work-back">
        <div class="wb-cover">${backCover}</div>
        <div class="wb-info">
          <h2>${w.titulo}</h2>
          <p>${w.desc}</p>
          <a class="wb-btn" href="${w.enlace}"><span>Saber más</span></a>
        </div>
      </div>
    </div>`;
  track.appendChild(el);
});

const cards = [...track.querySelectorAll('.work')];

/* ============================================================
   ARRASTRE HORIZONTAL · lerp + inercia (misma física que el
   smooth scroll vertical de la portada)
   ============================================================ */
let x = 0, tx = 0, minX = 0;
let dragging = false, startX = 0, startTx = 0, lastX = 0, vel = 0, moved = 0;

const clampX = v => Math.max(minX, Math.min(0, v));

function measure(){
  minX = Math.min(0, stage.clientWidth - track.scrollWidth);
  tx = clampX(tx);
}
new ResizeObserver(measure).observe(track);
addEventListener('resize', measure);
measure();

(function rafX(){
  x += (tx - x) * 0.11;
  if (Math.abs(tx - x) < 0.05) x = tx;
  track.style.transform = `translate3d(${x}px,0,0)`;
  requestAnimationFrame(rafX);
})();

stage.addEventListener('pointerdown', e => {
  dragging = true; moved = 0;
  startX = lastX = e.clientX;
  startTx = tx; vel = 0;
  stage.classList.add('dragging');
});
addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  moved = Math.max(moved, Math.abs(dx));
  tx = clampX(startTx + dx);
  vel = e.clientX - lastX;
  lastX = e.clientX;
});
addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');
  tx = clampX(tx + vel * 14); /* impulso de inercia al soltar */
});

/* rueda del ratón (desktop): vertical u horizontal, ambas mueven el carrusel */
stage.addEventListener('wheel', e => {
  e.preventDefault();
  tx = clampX(tx - e.deltaY - e.deltaX);
}, { passive:false });

/* si hubo arrastre real, el click posterior no cuenta */
stage.addEventListener('click', e => {
  if (moved > 8){ e.stopPropagation(); e.preventDefault(); }
}, true);

/* ============================================================
   VOLTEO + EXPANSIÓN
   ============================================================ */
let openWork = null;

const isMobile = () => matchMedia('(max-width:767px)').matches;

/* desktop: se ensancha · móvil: se ensancha Y crece en altura (formato ficha) */
function expandedSize(baseW, baseH){
  if (isMobile()){
    return {
      w: stage.clientWidth * 0.92,
      h: Math.min(innerHeight * 0.72, baseH * 1.85),
    };
  }
  return { w: Math.min(stage.clientWidth * 0.92, baseW * 2.3), h: baseH };
}

function openCard(el){
  if (openWork) closeCard(openWork);
  openWork = el;
  el.setAttribute('aria-expanded', 'true');

  const baseW = el.offsetWidth, baseH = el.offsetHeight;
  el.dataset.baseW = baseW;
  el.dataset.baseH = baseH;
  const size = expandedSize(baseW, baseH);
  const inner = el.querySelector('.work-3d');
  const backBits = el.querySelectorAll('.wb-cover, .wb-info');

  gsap.timeline({ defaults:{ overwrite:'auto' } })
    .to(inner, { rotationY:180, duration:.8, ease:'springOut' }, 0)
    .to(el, { width: size.w, height: size.h, duration:.7, ease:'springOut',
              onUpdate: measure }, .12)
    .fromTo(backBits,
      { opacity:0, y:14 },
      { opacity:1, y:0, duration:.45, ease:'glassIn', stagger:.08 }, .3)
    .add(centerCard(el), .15);
}

function closeCard(el){
  el.setAttribute('aria-expanded', 'false');
  const inner = el.querySelector('.work-3d');
  const backBits = el.querySelectorAll('.wb-cover, .wb-info');
  if (openWork === el) openWork = null;

  gsap.timeline({ defaults:{ overwrite:'auto' } })
    .to(backBits, { opacity:0, duration:.2, ease:'glassIn' }, 0)
    .to(inner, { rotationY:0, duration:.7, ease:'springOut' }, 0)
    .to(el, { width: parseFloat(el.dataset.baseW),
              height: parseFloat(el.dataset.baseH),
              duration:.6, ease:'springOut',
              onUpdate: measure, clearProps:'width,height' }, .05);
}

/* desplaza el carrusel para que la tarjeta expandida quede centrada.
   OJO: no se mide el DOM (otras tarjetas pueden estar aún encogiéndose
   y darían posiciones infladas); se calcula la geometría FINAL, que es
   conocida: todas las demás tarjetas acabarán en su ancho base. */
function centerCard(el){
  return () => {
    const baseW = parseFloat(el.dataset.baseW);
    const w = expandedSize(baseW, parseFloat(el.dataset.baseH)).w;
    const cs = getComputedStyle(track);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const gap  = parseFloat(cs.columnGap || cs.gap) || 0;
    const i = cards.indexOf(el);
    const n = cards.length;

    const left   = padL + i * (baseW + gap);                       /* posición final de la tarjeta */
    const trackW = padL + padR + n * baseW + (n - 1) * gap + (w - baseW); /* ancho final del track */
    const minXf  = Math.min(0, stage.clientWidth - trackW);
    const targetTx = Math.max(minXf, Math.min(0, (stage.clientWidth - w) / 2 - left));

    gsap.to({ v: tx }, {
      v: targetTx, duration:.7, ease:'glassIn',
      onUpdate(){ tx = this.targets()[0].v; }
    });
  };
}

cards.forEach(el => {
  el.addEventListener('click', e => {
    if (moved > 8) return;                 /* fue un arrastre, no un click */
    if (e.target.closest('.wb-btn')) return; /* el botón navega, no cierra */
    openWork === el ? closeCard(el) : openCard(el);
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openWork === el ? closeCard(el) : openCard(el);
    }
  });
});

/* Escape cierra la tarjeta abierta */
addEventListener('keydown', e => {
  if (e.key === 'Escape' && openWork) closeCard(openWork);
});
