// Reproductor de video a pantalla completa para una card del catalogo.
// Usa la API oficial de YouTube (YT.Player) en vez de un <iframe> crudo: los
// controles nativos de YouTube no responden al D-pad del control remoto, asi
// que controlamos el video por codigo (seek, play/pausa, volumen) desde
// nuestro propio manejo de teclas.
var PLAYER = (function () {
  var SEEK_SECONDS = 10;
  var VOLUME_STEP = 10;
  var HINT_VISIBLE_MS = 10000;

  var overlayEl, frameEl, hintEl;
  var ytPlayer = null;
  var isOpenFlag = false;
  var hintTimer = null;

  function fullscreenRequest(el) {
    return el.requestFullscreen || el.webkitRequestFullscreen ||
      el.mozRequestFullScreen || el.msRequestFullscreen;
  }

  function enterFullscreen() {
    var el = document.documentElement;
    var request = fullscreenRequest(el);
    if (request) {
      try { request.call(el); } catch (e) { /* ya esta en fullscreen o no soportado */ }
    }
  }

  function exitFullscreen() {
    var exit = document.exitFullscreen || document.webkitExitFullscreen ||
      document.mozCancelFullScreen || document.msExitFullscreen;
    var current = document.fullscreenElement || document.webkitFullscreenElement;
    if (exit && current) {
      try { exit.call(document); } catch (e) { /* nada que cerrar */ }
    }
  }

  function ensureYouTubeApi(onApiReady) {
    if (window.YT && window.YT.Player) {
      onApiReady();
      return;
    }
    if (!document.getElementById("youtubeIframeApiScript")) {
      var tag = document.createElement("script");
      tag.id = "youtubeIframeApiScript";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = onApiReady;
  }

  function createPlayer(youtubeId) {
    frameEl.innerHTML = '<div id="ytPlayerMount"></div>';
    ytPlayer = new YT.Player("ytPlayerMount", {
      width: "100%",
      height: "100%",
      videoId: youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        fs: 0
      },
      events: {
        onReady: function (e) { e.target.playVideo(); }
      }
    });
  }

  function seekBy(deltaSeconds) {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== "function") return;
    try {
      var target = Math.max(0, ytPlayer.getCurrentTime() + deltaSeconds);
      ytPlayer.seekTo(target, true);
    } catch (e) { /* el player aun no esta listo */ }
  }

  function changeVolumeBy(delta) {
    if (!ytPlayer || typeof ytPlayer.getVolume !== "function") return;
    try {
      var vol = Math.min(100, Math.max(0, ytPlayer.getVolume() + delta));
      ytPlayer.setVolume(vol);
    } catch (e) { /* el player aun no esta listo */ }
  }

  function togglePlayback() {
    if (!ytPlayer || typeof ytPlayer.getPlayerState !== "function") return;
    try {
      // 1 = reproduciendo (segun el estado del IFrame Player API de YouTube)
      if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    } catch (e) { /* el player aun no esta listo */ }
  }

  function onPlayerKeyDown(e) {
    switch (e.keyCode) {
      case 37: seekBy(-SEEK_SECONDS); e.preventDefault(); break;   // izquierda: retroceder
      case 39: seekBy(SEEK_SECONDS); e.preventDefault(); break;    // derecha: avanzar
      case 38: changeVolumeBy(VOLUME_STEP); e.preventDefault(); break;   // arriba: subir volumen
      case 40: changeVolumeBy(-VOLUME_STEP); e.preventDefault(); break; // abajo: bajar volumen
      case 13: togglePlayback(); e.preventDefault(); break;        // enter/ok: pausar/reproducir
      case 10009: // back (control remoto Tizen)
      case 27:    // Esc (al probar en navegador de escritorio; el navegador puede
                  // consumir la primera pulsacion para salir de pantalla completa)
      case 8:     // Backspace: salida dedicada, sin conflicto con fullscreen del navegador
        close();
        e.preventDefault();
        break;
      default: break;
    }
  }

  function showHint() {
    hintEl.classList.remove("hint-hidden");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      hintEl.classList.add("hint-hidden");
    }, HINT_VISIBLE_MS);
  }

  function open(youtubeId) {
    overlayEl.classList.remove("hidden");
    isOpenFlag = true;
    enterFullscreen();
    showHint();
    NAV.setKeyHandler(onPlayerKeyDown);
    ensureYouTubeApi(function () {
      createPlayer(youtubeId);
    });
  }

  function close() {
    if (ytPlayer && typeof ytPlayer.destroy === "function") {
      try { ytPlayer.destroy(); } catch (e) { /* ya estaba destruido */ }
    }
    ytPlayer = null;
    frameEl.innerHTML = "";
    overlayEl.classList.add("hidden");
    isOpenFlag = false;
    clearTimeout(hintTimer);
    NAV.clearKeyHandler();
    exitFullscreen();
    APP.restoreMainNav();
  }

  function isOpen() {
    return isOpenFlag;
  }

  function init() {
    overlayEl = document.getElementById("playerOverlay");
    frameEl = document.getElementById("playerFrame");
    hintEl = document.getElementById("playerHint");
  }

  return {
    init: init,
    open: open,
    close: close,
    isOpen: isOpen
  };
})();
