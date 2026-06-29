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
  const videoDurationMs = 1104 * 1000; // 18:24 en milisegundos

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

document.addEventListener('DOMContentLoaded', () => {
  setupPlayerClickListener();
  setupVideoEndTimer();
  setupScrollAfter5s();
});

setTimeout(() => {
  setupPlayerClickListener();
  setupVideoEndTimer();
}, 500);
