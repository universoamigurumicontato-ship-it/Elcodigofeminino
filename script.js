// Desbloquear áudio do navegador
function unlockAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
  ctx.resume();
}

function tryUnmuteVTurb() {
  document.querySelectorAll('video').forEach(v => {
    v.muted = false;
    v.volume = 1;
    if (v.paused) v.play().catch(() => {});
  });
  const player = document.getElementById('vid-6a3f02d0d7338761a2d0a25b');
  if (player && player.smartplayer) {
    try { player.smartplayer.unmute(); } catch(e) {}
    try { player.smartplayer.play(); } catch(e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('sound-overlay');
  const btn = document.getElementById('sound-btn');

  if (btn) {
    btn.addEventListener('click', () => {
      unlockAudio();
      overlay.classList.add('hidden');
      tryUnmuteVTurb();
      setTimeout(tryUnmuteVTurb, 500);
      setTimeout(tryUnmuteVTurb, 1500);
    });
  }

  setupPlayerClickListener();
  setupVideoEndTimer();
  setupScrollAfter5s();
});

// Contador de visualizadores
const viewerText = document.getElementById('viewer-text');
let viewers = 200;
let isPaused = false;

function updateViewers() {
  const variation = Math.floor(Math.random() * 11) - 5;
  viewers = Math.max(100, viewers + variation);
  viewerText.textContent = `${viewers} personas viendo ahora`;
}

setInterval(updateViewers, Math.random() * 2000 + 3000);

function showPauseGif() {
  const gifOverlay = document.getElementById('gif-overlay');
  gifOverlay.classList.remove('hidden');
  gifOverlay.classList.add('visible');
}

function hidePauseGif() {
  const gifOverlay = document.getElementById('gif-overlay');
  gifOverlay.classList.add('hidden');
  gifOverlay.classList.remove('visible');
}

function showCTA() {
  const ctaElement = document.getElementById('cta');
  ctaElement.classList.add('visible');
  setTimeout(() => {
    ctaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
}

// Detectar clics en el player
function setupPlayerClickListener() {
  const overlay = document.getElementById('player-click-overlay');

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.stopPropagation();
      isPaused = !isPaused;

      if (isPaused) {
        showPauseGif();
      } else {
        hidePauseGif();
      }
    });
  }
}

// Scroll suave até o final da página após 5 segundos de vídeo
function setupScrollAfter5s() {
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 5000);
}

// Mostrar botón CTA en el minuto 18:24 del vídeo
// 18:24 = 18*60 + 24 = 1104 segundos
function setupVideoEndTimer() {
  const videoDurationMs = 984 * 1000; // 16:24 en milisegundos

  setTimeout(() => {
    console.log('Minuto 18:24 - Mostrando CTA');
    showCTA();
  }, videoDurationMs);

  // También intentar detectar mediante postMessage del iframe
  setupVTurbEndDetection();
}

// Intenta detectar el fin del vídeo a través del iframe
function setupVTurbEndDetection() {
  window.addEventListener('message', function(event) {
    if (event.data && event.data.event === 'vturb_ended') {
      console.log('VTurb ended event recibido');
      showCTA();
    }
  });

  // Monitorear el iframe del VTurb
  const observer = new MutationObserver(() => {
    const iframe = document.querySelector('vturb-smartplayer iframe');
    if (iframe && !iframe.hasListener) {
      iframe.hasListener = true;
      console.log('iframe VTurb encontrado');
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

setTimeout(() => {
  setupPlayerClickListener();
}, 500);
