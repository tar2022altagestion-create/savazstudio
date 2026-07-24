/* ============================================================
   PORTFOLIO · dos secciones (Carteles / Trabajos 3D) con
   transición de cortina de garabato, arrastre con inercia
   y tarjetas con volteo.
   ============================================================ */

/* ------------------------------------------------------------
   TUS TRABAJOS · edita solo los textos entre comillas.

   REGLAS PARA NO ROMPER NADA:
   1. No borres las comillas ni las comas.
   2. Escribe la descripción de un tirón, SIN pulsar Enter en medio.
   3. Si tu texto lleva un apóstrofe (it's), escríbelo it\'s
      o rodea todo el texto con comillas dobles: desc:"it's así".
   4. Las comillas dobles " dentro de comillas simples no dan problema.
   5. SALTO DE LINEA: escribe <br> donde quieras cortar el texto.
      Línea en blanco entre párrafos: <br><br>

   Hay DOS listas: WORKS_CARTELES y WORKS_3D. Cada una es una
   sección del portfolio. Añade cada trabajo a su lista.
   ------------------------------------------------------------ */
const WORKS_CARTELES = [
  {
    titulo:'Is God Dead?',
    desc:'Una exploración del nihilismo, la crisis de fe y la moral en el tema "God Is Dead?" de Black Sabbath, planteando la espiritualidad individual como resistencia al caos moderno.',
    img:'assets/img/works/is-god-dead.jpg',
    enlace:'#'
  },
  {
    titulo:'Snowblind',
    desc:'Cartel para el clásico de Black Sabbath. La estela del avión como línea de coca, blanco sobre azul.',
    img:'assets/img/works/snowblind.jpg',
    enlace:'#'
  },
  {
    titulo:'MF DOOM',
    desc:'Retrato de quien nunca quiso ser retratado. Píxeles en lugar de rostro, fuego en lugar de marco: lo único que queda nítido es la firma. MF DOOM el villano del rap',
    img:'assets/img/works/mf-doom.jpg',
    enlace:'#'
  },
  {
    titulo:"Bed's Too Big Without You",
    desc:'La ausencia no es la falta de algo, sino su presencia insoportable. El vacío que deja alguien no está hueco: pesa, ocupa, ensancha la habitación hasta hacerla inhabitable.<br><br>Cartel para mi canción favorita de The Police.',
    img:'assets/img/works/beds-too-big.jpg',
    enlace:'#'
  },
  {
    titulo:'Savaz Studio',
    desc:'Edición limitada de una mente en combustión.',
    img:'assets/img/works/savaz-studio.jpg',
    enlace:'#'
  },
  {
    titulo:'Restricted Lane',
    desc:'Toda señal supone un cuerpo obediente. Pero el símbolo también fuma, se desvía, incumple: no hay norma que sobreviva al que la habita.',
    img:'assets/img/works/restricted-lane.jpg',
    enlace:'#'
  },
  {
    titulo:'Red Skin',
    desc:'Ese rojo no es rubor ni vergüenza. Es lo que pasa cuando alguien decide arder por gusto y le sale bien<br><br>Propuesta para Vogue',
    img:'assets/img/works/red-skin.jpg',
    enlace:'#'
  },
  {
    titulo:'Black Sabbath Merch',
    desc:'Toda banda con suficientes años acaba siendo una religión.<br><br>Merchandising como estampa devocional: llevas puesto a quién rezas, y el desgaste de la tela es la prueba de fe.',
    img:'assets/img/works/black-sabbath-merch.jpg',
    enlace:'#'
  },
  {
    titulo:'Marty Supreme',
    desc:'Su descripción.',
    img:'assets/img/works/marty-supreme.webp',
    enlace:'#'
  },
  {
    titulo:'Dos en Uno',
    desc:'Su descripción.',
    img:'assets/img/works/have-a-cigar.webp',
    enlace:'#'
  },
  {
    titulo:'Sweet Leaf',
    desc:'Su descripción.',
    img:'assets/img/works/sweet-leaf.webp',
    enlace:'#'
  },
  {
    titulo:'Marlboro Blues',
    desc:'Su descripción.',
    img:'assets/img/works/marlboro-blue.webp',
    enlace:'#'
  },
  {
    titulo:'The Lighthouse',
    desc:'Su descripción.',
    img:'assets/img/works/the-lighthouse.webp',
    enlace:'#'
  },
  {
    titulo:'Ashes To Ashes',
    desc:'Su descripción.',
    img:'assets/img/works/ashes-to-ashes.webp',
    enlace:'#'
  },
  {
    titulo:'Camel',
    desc:'Su descripción.',
    img:'assets/img/works/camel.webp',
    enlace:'#'
  },
];

/* Trabajos en 3D: cuatro tarjetas preparadas. Cuando tengas los
   renders, pon su ruta en img (p.ej. 'assets/img/works/mi-3d.webp')
   y el placeholder desaparece solo. */
const WORKS_3D = [
  {
    titulo:'Trabajo 3D 01',
    desc:'Hueco reservado — cambia el título, esta descripción y añade la imagen del render cuando lo tengas.',
    img:'',
    enlace:'#'
  },
  {
    titulo:'Trabajo 3D 02',
    desc:'Hueco reservado — cambia el título, esta descripción y añade la imagen del render cuando lo tengas.',
    img:'',
    enlace:'#'
  },
  {
    titulo:'Trabajo 3D 03',
    desc:'Hueco reservado — cambia el título, esta descripción y añade la imagen del render cuando lo tengas.',
    img:'',
    enlace:'#'
  },
  {
    titulo:'Trabajo 3D 04',
    desc:'Hueco reservado — cambia el título, esta descripción y añade la imagen del render cuando lo tengas.',
    img:'',
    enlace:'#'
  },
];

/* ============================================================
   ESTADO DE SECCIONES
   ============================================================ */
const LISTS  = { carteles: WORKS_CARTELES, tresd: WORKS_3D };
const LABELS = { carteles: 'Carteles',     tresd: 'Trabajos 3D' };
let section = 'carteles';
const otherSection = () => section === 'carteles' ? 'tresd' : 'carteles';

const stage = document.getElementById('worksStage');
const track = document.getElementById('worksTrack');
const sectionLabel = document.getElementById('sectionLabel');
const curtain = document.getElementById('curtain');
const curtainMain = document.getElementById('curtainPath');
const curtainScr1 = document.getElementById('curtainScr1');
const curtainScr2 = document.getElementById('curtainScr2');

/* Convierte el texto en HTML seguro: escapa cualquier etiqueta salvo <br>,
   que se permite para maquetar saltos de línea en las descripciones. */
function brOnly(txt){
  const esc = String(txt)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}

/* ============================================================
   CONSTRUCCIÓN DE TARJETAS (se reconstruyen al cambiar de sección)
   ============================================================ */
let cards = [];

function buildCards(){
  track.innerHTML = '';
  openWork = null;

  LISTS[section].forEach((w, i) => {
    const el = document.createElement('article');
    el.className = 'work';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-label', `${w.titulo} — ver detalle`);

    const img = w.img
      ? `<img src="${w.img}" alt="" loading="lazy" decoding="async" draggable="false">`
      : '';
    const ph = `<div class="work-ph">
                  <span class="ph-num">${String(i + 1).padStart(2, '0')}</span>
                  <span class="ph-name">${brOnly(w.titulo)}</span>
                </div>`;

    el.innerHTML = `
      <div class="work-3d">
        <div class="work-front">${img || ph}</div>
        <div class="work-back">
          <div class="wb-cover">${img || ph}</div>
          <div class="wb-info">
            <h2>${brOnly(w.titulo)}</h2>
            <p>${brOnly(w.desc)}</p>
            <a class="wb-btn" href="${w.enlace}"><span>Saber más</span></a>
          </div>
        </div>
      </div>`;

    el.addEventListener('click', e => {
      if (moved > 8) return;                   /* fue un arrastre, no un click */
      if (e.target.closest('.wb-btn')) return; /* el botón navega, no cierra */
      openWork === el ? closeCard(el) : openCard(el);
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openWork === el ? closeCard(el) : openCard(el);
      }
    });

    track.appendChild(el);
  });

  /* remate del carril: invita a pasar a la otra sección */
  const cap = document.createElement('button');
  cap.className = 'track-endcap';
  cap.setAttribute('aria-label', `Ir a ${LABELS[otherSection()]}`);
  cap.innerHTML = `
    <span class="cap-arrow" aria-hidden="true">→</span>
    <span class="cap-label">${LABELS[otherSection()]}</span>`;
  cap.addEventListener('click', () => goToSection(otherSection()));
  track.appendChild(cap);

  cards = [...track.querySelectorAll('.work')];
  measure();
}

/* ============================================================
   ARRASTRE HORIZONTAL · lerp + inercia + tirón en los extremos
   ============================================================ */
let x = 0, tx = 0, minX = 0;
let dragging = false, startX = 0, startTx = 0, lastX = 0, vel = 0, moved = 0;
let overPull = 0;              /* cuánto se ha tirado más allá del borde */
const OVER_TRIG = 110;         /* tirón necesario para cambiar de sección */

const clampX = v => Math.max(minX, Math.min(0, v));

function measure(){
  minX = Math.min(0, stage.clientWidth - track.scrollWidth);
  if (!dragging) tx = clampX(tx);
}
new ResizeObserver(measure).observe(track);
addEventListener('resize', measure);

(function rafX(){
  x += (tx - x) * 0.11;
  if (Math.abs(tx - x) < 0.05) x = tx;
  track.style.transform = `translate3d(${x}px,0,0)`;
  requestAnimationFrame(rafX);
})();

stage.addEventListener('pointerdown', e => {
  if (transitioning) return;
  dragging = true; moved = 0; overPull = 0;
  startX = lastX = e.clientX;
  startTx = tx; vel = 0;
  stage.classList.add('dragging');
});
addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  moved = Math.max(moved, Math.abs(dx));
  const raw = startTx + dx;
  /* dentro de los límites: normal · fuera: goma elástica y contamos el tirón */
  let over = 0;
  if (raw < minX) over = raw - minX;
  else if (raw > 0) over = raw;
  overPull = over;
  tx = clampX(raw) + over * 0.25;
  vel = e.clientX - lastX;
  lastX = e.clientX;
});
addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');

  if (overPull < -OVER_TRIG){
    /* tirón más allá del final -> siguiente sección */
    goToSection(otherSection());
    tx = clampX(tx);
  } else if (overPull > OVER_TRIG && section === 'tresd'){
    /* tirón más allá del principio en 3D -> volver a carteles */
    goToSection('carteles');
    tx = clampX(tx);
  } else {
    tx = clampX(tx + vel * 14); /* impulso de inercia al soltar */
  }
  overPull = 0;
});

/* rueda del ratón: mueve el carrusel; insistir en el tope cambia de sección */
let wheelAcc = 0, wheelBack = 0;
stage.addEventListener('wheel', e => {
  e.preventDefault();
  if (transitioning) return;
  const d = e.deltaY + e.deltaX;
  const raw = tx - d;
  if (raw < minX - 2 && d > 0){
    wheelAcc += d;
    if (wheelAcc > 340){ wheelAcc = 0; goToSection(otherSection()); }
  } else if (raw > 2 && d < 0 && section === 'tresd'){
    wheelBack += -d;
    if (wheelBack > 340){ wheelBack = 0; goToSection('carteles'); }
  } else {
    wheelAcc = wheelBack = 0;
  }
  tx = clampX(raw);
}, { passive:false });

/* si hubo arrastre real, el click posterior no cuenta */
stage.addEventListener('click', e => {
  if (moved > 8){ e.stopPropagation(); e.preventDefault(); }
}, true);

/* ============================================================
   CORTINA DE GARABATO · transición entre secciones
   ============================================================ */
let transitioning = false;

/* genera los trazos con jitter aleatorio: cada barrido es distinto */
function drawCurtain(){
  const H = 1000, L = 220, R = 2780, steps = 30;
  const jitter = amp => (Math.random() - 0.3) * amp;

  let d = `M ${L} 0 `;
  for (let i = 1; i <= steps; i++){
    d += `L ${(L + jitter(150)).toFixed(0)} ${(H * i / steps).toFixed(0)} `;
  }
  d += `L ${R} ${H} `;
  for (let i = steps - 1; i >= 0; i--){
    d += `L ${(R + jitter(150)).toFixed(0)} ${(H * i / steps).toFixed(0)} `;
  }
  d += 'Z';
  curtainMain.setAttribute('d', d);

  /* garabatos sueltos que acompañan a cada borde */
  const squiggle = cx => {
    let s = `M ${cx + jitter(80)} -20 `;
    for (let i = 1; i <= 16; i++){
      s += `L ${(cx + jitter(160)).toFixed(0)} ${(H * i / 16 + 20).toFixed(0)} `;
    }
    return s;
  };
  curtainScr1.setAttribute('d', squiggle(L - 70));
  curtainScr2.setAttribute('d', squiggle(R + 70));
}

function setLabel(){
  sectionLabel.textContent = LABELS[section];
  gsap.fromTo(sectionLabel, { y:8, opacity:0 }, { y:0, opacity:1, duration:.4, ease:'glassIn' });
}

function swapSection(target){
  section = target;
  buildCards();
  tx = x = 0;
  track.style.transform = 'translate3d(0,0,0)';
  setLabel();
}

function goToSection(target){
  if (transitioning || target === section) return;
  transitioning = true;
  wheelAcc = wheelBack = 0;
  if (openWork) closeCard(openWork);

  if (reduceMotion){
    gsap.timeline({ onComplete: () => transitioning = false })
      .to(stage, { opacity:0, duration:.2 })
      .add(() => swapSection(target))
      .to(stage, { opacity:1, duration:.25 });
    return;
  }

  drawCurtain();
  const svg = curtain.querySelector('svg');
  curtain.style.visibility = 'visible';

  gsap.fromTo(svg,
    { x: '100vw' },
    { x: '-320vw', duration: 1.25, ease: 'power2.inOut',
      onComplete(){
        curtain.style.visibility = 'hidden';
        transitioning = false;
      }
    });

  /* la pantalla queda totalmente cubierta hacia la mitad del barrido:
     ahí se hace el cambio, invisible para el ojo */
  gsap.delayedCall(.52, () => swapSection(target));
}

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
   Se calcula la geometría FINAL (las demás tarjetas acabarán en su
   ancho base), no la del DOM en plena animación. */
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

    const left   = padL + i * (baseW + gap);
    const trackW = padL + padR + n * baseW + (n - 1) * gap + (w - baseW)
                 + 140; /* hueco aproximado del remate final del carril */
    const minXf  = Math.min(0, stage.clientWidth - trackW);
    const targetTx = Math.max(minXf, Math.min(0, (stage.clientWidth - w) / 2 - left));

    gsap.to({ v: tx }, {
      v: targetTx, duration:.7, ease:'glassIn',
      onUpdate(){ tx = this.targets()[0].v; }
    });
  };
}

/* Escape cierra la tarjeta abierta */
addEventListener('keydown', e => {
  if (e.key === 'Escape' && openWork) closeCard(openWork);
});

/* ============================================================
   ARRANQUE
   ============================================================ */
buildCards();
