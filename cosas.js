/* ---------- STARS CANVAS ---------- */
const starsCanvas = document.getElementById('stars');
const sCtx = starsCanvas.getContext('2d');

function resizeStars(){
  const dpr = window.devicePixelRatio || 1;
  starsCanvas.width = Math.floor(window.innerWidth * dpr);
  starsCanvas.height = Math.floor(window.innerHeight * dpr);
  starsCanvas.style.width = window.innerWidth + 'px';
  starsCanvas.style.height = window.innerHeight + 'px';
  sCtx.setTransform(dpr,0,0,dpr,0,0);
}
resizeStars();
window.addEventListener('resize', resizeStars);

const STAR_COUNT = Math.max(80, Math.floor(window.innerWidth / 10));
const stars = [];
for (let i=0; i<STAR_COUNT; i++){
  stars.push({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    r: Math.random()*1.4 + 0.25,
    baseA: 0.3 + Math.random()*0.7,
    speed: 0.5 + Math.random()*1.6,
    phase: Math.random()*Math.PI*2
  });
}

function drawStars(now){
  const t = now * 0.001;
  sCtx.clearRect(0,0,starsCanvas.width, starsCanvas.height);
  for (const st of stars){
    const a = st.baseA + Math.sin(t * st.speed + st.phase) * 0.35;
    sCtx.globalAlpha = Math.max(0, Math.min(1, a));
    sCtx.beginPath();
    sCtx.fillStyle = '#fff';
    sCtx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    sCtx.fill();
  }
  sCtx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

/* ---------- MOON, FLASH, CRATERS & HEARTS ---------- */
const moon = document.getElementById('moon');
const flash = document.getElementById('flash');
const heartsContainer = document.getElementById('hearts-container');
const flower = document.getElementById("flower-container");

let heartInterval = null;
let activated = false;

const heartColors = ["#f54927","#da27f5","#ff99cc","#ffffff","#ffff26"];

/* click on moon sequence:
   1) fade-in flash (0.8s)
   2) fade-out flash (1s)
   3) shrink/move moon and start hearts
*/

moon.addEventListener('click', (ev) => {
  ev.stopPropagation();
  if (activated) return;
  activated = true;

  // fade-in quick
  flash.style.transition = 'opacity 0.8s ease-in';
  flash.style.opacity = '1';

  setTimeout(()=> {
    // fade-out slow
    flash.style.transition = 'opacity 1s ease-out';
    flash.style.opacity = '0';

    setTimeout(()=> {
      // shrink & move moon
      moon.classList.add('shrink');
      // start hearts automatically
      
      heartInterval = setInterval(()=> createHeart(), 300);
      flower.classList.add("show");
    }, 900);
  }, 800);
});

/* Lista de frases */
const frases = [
  "TQM 💛",
  "ALEJITA PRECIOSA 🌻",
  "FELIZ DIA",
  "MI PEDAGOGA FAV 💆‍♀️",
  "UwU 💖",
  "MUIKITTY 😽",
  "VAYA A DORMIR JSJSJS",
  "❤️"
];

/* Create floating heart (random color). If x,y provided, put there. */
function createHeart(x = null, y = null) {
  const el = document.createElement('div');
  el.className = 'heart';

  // Selecciona una frase aleatoria
  el.textContent = frases[Math.floor(Math.random() * frases.length)];

  el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];

  if (typeof x === 'number' && typeof y === 'number') {
    el.style.left = (x - 14) + 'px';
    el.style.top = (y - 18) + 'px';
  } else {
    el.style.left = (Math.random() * (window.innerWidth - 40)) + 'px';
    el.style.top = (window.innerHeight - 120) + 'px';
  }

  heartsContainer.appendChild(el);

  // Eliminar después de la animación
  setTimeout(() => {
    if (el && el.parentNode) el.remove();
  }, 2200);
}

// ❤️ Corazones al hacer clic (aleatorios)
document.addEventListener("click", e => {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";

  // Lista de corazones
  const hearts = ["❤️","MUIKITTY", "💖", "💗","MUIKITTY", "❤️‍🔥", "💛", "❣️", "🩷","💛","💛","TQM","TQM","MUIKITTY"];
  // Elegir uno al azar
  const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];

  heart.textContent = randomHeart;
  document.body.appendChild(heart);

  // Eliminar después de 1.5s
  setTimeout(() => heart.remove(), 1500);
});

/* ---------- PLAYER ---------- */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const audioHint = document.getElementById('audioHint');
let isPlaying = false;

async function tryPlay(){
  try {
    await audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸';
    audioHint.style.display = 'none';
  } catch(err) {
    // blocked by browser -> ask user gesture
    audioHint.textContent = 'Toca la pantalla para permitir audio';
    audioHint.style.display = 'block';
    const resume = async ()=> {
      try { await audio.play(); playBtn.textContent = '⏸'; audioHint.style.display='none'; isPlaying=true; document.body.removeEventListener('pointerdown', resume); }
      catch(e){}
    };
    document.body.addEventListener('pointerdown', resume, { once:true });
  }
}

playBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (!isPlaying) await tryPlay();
  else { audio.pause(); isPlaying=false; playBtn.textContent='▶'; }
});

audio.addEventListener('pause', ()=> { isPlaying=false; playBtn.textContent='▶'; });
audio.addEventListener('play', ()=> { isPlaying=true; playBtn.textContent='⏸'; });
audio.addEventListener('error', ()=> {
  audioHint.textContent = 'No se pudo cargar la canción (floricienta.mp3)';
  audioHint.style.display = 'block';
});

/* keep canvas sized when resize */
window.addEventListener('resize', () => { resizeStars(); });

onload = () =>{
        document.body.classList.remove("container");
};

// Detectar clic en la luna
document.getElementById("moon").addEventListener("click", function() {
  let frase = document.getElementById("fraseSecreta");
  
  if (frase.style.display === "none" || frase.style.display === "") {
    frase.style.display = "block"; // mostrar la frase
  } else {
    frase.style.display = "none";  // ocultar la frase (opcional)
  }
});
document.getElementById("moon").addEventListener("click", function() {
  let frase = document.getElementById("fraseSecreta");
  frase.classList.toggle("show");
});
const frase = document.getElementById("fraseSecreta");
const dedicatoria = document.getElementById("dedicatoria");

moon.addEventListener("click", () => {
  frase.style.display = "block";
  dedicatoria.style.display = "block";
});