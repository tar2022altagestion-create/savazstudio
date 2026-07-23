/* ============================================================
   PORTADA · ojo, titular a sangre y tocadiscos
   ============================================================ */
/* Dibujos de respaldo: se asignan desde js/img-data.js */
document.querySelector('.eye-open').src   = IMGS.ojoAbierto;
document.querySelector('.eye-closed').src = IMGS.ojoCerrado;
document.querySelector('#ttDisc img').src = IMGS.vinilo;
document.querySelector('#ttArm img').src  = IMGS.brazo;

/* ============================================================
   EL OJO · boiling del trazo + interruptor día/noche
   ============================================================ */
const eye  = document.getElementById('eye');
const tagline = document.getElementById('tagline');
let isNight = document.documentElement.getAttribute('data-theme') === 'dark';
let blinking = false, boilTimer = null;

/* si venimos de otra página en modo noche, el ojo aparece ya cerrado */
if (isNight){
  eye.classList.add('is-closed');
  eye.setAttribute('aria-pressed', 'true');
  eye.setAttribute('aria-label', 'Cambiar a modo día');
  tagline.textContent = 'Good morning';
}

/* ------------------------------------------------------------
   BOILING PRE-RENDERIZADO
   Antes: el filtro SVG recalculaba la turbulencia ~9 veces/seg
   en vivo (CPU, carísimo en móvil). Ahora: se generan unos pocos
   frames deformados UNA sola vez al cargar y luego solo se cicla
   un drawImage sobre canvas (coste casi cero por frame).
   ------------------------------------------------------------ */
const cvs = document.getElementById('eyeCanvas');
const ctx = cvs.getContext('2d');
const CW = 640, CH = 414;
const imgOpen   = eye.querySelector('.eye-open');
const imgClosed = eye.querySelector('.eye-closed');
let frames = null, frameIdx = 0;

function renderBoilFrame(src, w, h, seed){
  return new Promise((resolve, reject) => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<filter id="b" x="-8%" y="-8%" width="116%" height="116%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="1" seed="${seed}"/>` +
      `<feDisplacementMap in="SourceGraphic" scale="${CONFIG.boilScale}" xChannelSelector="R" yChannelSelector="G"/>` +
      `</filter>` +
      `<image href="${src}" width="${w}" height="${h}" filter="url(#b)"/></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type:'image/svg+xml' }));
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(im, 0, 0);
      URL.revokeObjectURL(url);
      resolve(c);
    };
    im.onerror = () => { URL.revokeObjectURL(url); reject(); };
    im.src = url;
  });
}

async function buildFrames(){
  const seeds = [7, 233, 811];
  const [o, c] = await Promise.all([
    Promise.all(seeds.map(s => renderBoilFrame(imgOpen.src, 640, 414, s))),
    Promise.all(seeds.map(s => renderBoilFrame(imgClosed.src, 640, 199, s))),
  ]);
  frames = { open:o, closed:c };
  drawEye();
  eye.classList.add('canvas-ready');
}

function drawEye(){
  if (!frames) return;
  const set = frames[isNight ? 'closed' : 'open'];
  const f = set[frameIdx % set.length];
  ctx.clearRect(0, 0, CW, CH);
  ctx.drawImage(f, 0, (CH - f.height) / 2);
}

function startBoil(){
  if (boilTimer || reduceMotion) return;
  boilTimer = setInterval(() => { frameIdx++; drawEye(); }, 1000 / CONFIG.boilFps);
}
function stopBoil(){ clearInterval(boilTimer); boilTimer = null; }

/* si algo falla (navegador sin soporte), quedan los PNG estáticos
   con la micro-vibración CSS: nunca se rompe */
buildFrames().then(startBoil).catch(() => {});

/* se pausa cuando el ojo sale de pantalla (rendimiento) */
new IntersectionObserver(([entry]) =>
  entry.isIntersecting ? (frames && startBoil()) : stopBoil()
).observe(eye);

/* Parpadeo: el ojo se cierra/abre y la página cambia de tema
   justo en el momento del "clac" */
function blink(){
  if (blinking) return;
  blinking = true;
  isNight = !isNight;
  eye.setAttribute('aria-pressed', String(isNight));
  eye.setAttribute('aria-label', isNight ? 'Cambiar a modo día' : 'Cambiar a modo noche');

  gsap.timeline({ onComplete: () => blinking = false })
    .to(eye, { scaleY:.12, duration:.13, ease:'glassIn' })
    .to(tagline, { opacity:0, y:6, duration:.16, ease:'glassIn' }, 0)
    .add(() => {
      eye.classList.toggle('is-closed', isNight);
      document.documentElement.setAttribute('data-theme', isNight ? 'dark' : 'light');
      localStorage.setItem('savaz-theme', isNight ? 'dark' : 'light');
      tagline.textContent = isNight ? 'Good morning' : "Shh... it's getting late";
      drawEye(); /* refresco inmediato del canvas en el "clac" */
    })
    .to(tagline, { opacity:1, y:0, duration:.4, ease:'glassIn' })
    .to(eye, { scaleY:1, duration:.5, ease:'springOut' }, '<');
}
eye.addEventListener('click', blink);

/* ============================================================
   TITULAR A SANGRE · en desktop se mide el ancho real del texto
   y se escala para que toque exactamente los bordes, pase lo
   que pase con la fuente o el tamaño de ventana.
   ============================================================ */
const title = document.querySelector('.studio-title');
const titleWords = title.querySelectorAll('span');
function fitTitle(){
  if (innerWidth < 768){ title.style.fontSize = ''; return; } /* móvil: CSS */
  title.style.fontSize = '100px'; /* tamaño de referencia para medir */
  const gap = 0.14 * 100;
  const w = [...titleWords].reduce((t, s) => t + s.offsetWidth, 0)
          + gap * (titleWords.length - 1);
  /* 1.015 compensa el aire lateral propio de los glifos */
  title.style.fontSize = (100 * innerWidth / w * 1.015) + 'px';
}
addEventListener('resize', fitTitle);
if (document.fonts) document.fonts.ready.then(fitTitle); /* re-mide con la fuente ya cargada */
fitTitle();

/* ============================================================
   TOCADISCOS · boiling + brazo + giro del vinilo + música
   ============================================================ */
const AUDIO_SRC = 'assets/audio/snowblind.m4a';

const tt     = document.getElementById('turntable');
const ttDisc = document.getElementById('ttDisc');
const ttArm  = document.getElementById('ttArm');
const dCvs = ttDisc.querySelector('canvas'), dCtx = dCvs.getContext('2d');
const aCvs = ttArm.querySelector('canvas'),  aCtx = aCvs.getContext('2d');
const dImg = ttDisc.querySelector('img'),    aImg = ttArm.querySelector('img');
const ttAudio = new Audio();
ttAudio.loop = true;
if (AUDIO_SRC) ttAudio.src = AUDIO_SRC;

let ttFrames = null, ttIdx = 0, ttTimer = null, playing = false, spinTween = null;

async function buildTTFrames(){
  const seeds = [31, 407, 977];
  const [d, a] = await Promise.all([
    Promise.all(seeds.map(sd => renderBoilFrame(dImg.src, 560, 555, sd))),
    Promise.all(seeds.map(sd => renderBoilFrame(aImg.src, 200, 531, sd))),
  ]);
  ttFrames = { disc: d, arm: a };
  drawTT();
  tt.classList.add('canvas-ready');
}
function drawTT(){
  if (!ttFrames) return;
  dCtx.clearRect(0, 0, 560, 555); dCtx.drawImage(ttFrames.disc[ttIdx % 3], 0, 0);
  aCtx.clearRect(0, 0, 200, 531); aCtx.drawImage(ttFrames.arm[ttIdx % 3], 0, 0);
}
function startTTBoil(){
  if (ttTimer || reduceMotion) return;
  ttTimer = setInterval(() => { ttIdx++; drawTT(); }, 1000 / CONFIG.boilFps);
}
function stopTTBoil(){ clearInterval(ttTimer); ttTimer = null; }

buildTTFrames().then(startTTBoil).catch(() => {}); /* fallback: PNG estáticos */
new IntersectionObserver(([e]) =>
  e.isIntersecting ? (ttFrames && startTTBoil()) : stopTTBoil()
).observe(tt);

function ttToggle(){
  playing = !playing;
  tt.setAttribute('aria-pressed', String(playing));
  tt.setAttribute('aria-label', playing ? 'Parar la música' : 'Reproducir música');

  if (playing){
    /* el brazo se posa sobre el vinilo (giro antihorario: la punta va a la derecha) */
    gsap.to(ttArm, { rotation:-30, transformOrigin:'54% 25%', duration:.9, ease:'springOut' });
    /* …y el disco gira en bucle a velocidad constante */
    spinTween = gsap.to(ttDisc, { rotation:'+=360', duration:1.8, ease:'none', repeat:-1 });
    if (ttAudio.src) ttAudio.play().catch(() => {});
  } else {
    gsap.to(ttArm, { rotation:0, duration:.7, ease:'springOut' });
    if (spinTween) spinTween.kill();
    /* frenada con inercia, como un plato de verdad */
    gsap.to(ttDisc, { rotation:'+=55', duration:1.1, ease:'power2.out' });
    ttAudio.pause();
  }
}
tt.addEventListener('click', ttToggle);

