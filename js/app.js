(function () {
  function registerTizenBackKey() {
    try {
      if (typeof tizen !== "undefined" && tizen.tvinputdevice) {
        tizen.tvinputdevice.registerKey("Back");
      }
    } catch (e) {
      // Ejecutando fuera de Tizen (navegador de escritorio): se ignora.
    }
  }

  function requestFullscreenOnFirstInput() {
    function enter() {
      document.removeEventListener("keydown", enter);
      document.removeEventListener("click", enter);
      var el = document.documentElement;
      var request = el.requestFullscreen || el.webkitRequestFullscreen ||
        el.mozRequestFullScreen || el.msRequestFullscreen;
      if (request) {
        try { request.call(el); } catch (e) {
          // El navegador rechazo la solicitud (por ejemplo, ya esta en fullscreen).
        }
      }
    }
    document.addEventListener("keydown", enter);
    document.addEventListener("click", enter);
  }

  function exitApp() {
    try {
      if (typeof tizen !== "undefined" && tizen.application) {
        tizen.application.getCurrentApplication().exit();
      }
    } catch (e) {
      // Ejecutando fuera de Tizen: no hay nada que cerrar.
    }
  }

  function renderHero(hero) {
    document.getElementById("heroBg").style.backgroundImage = "url('" + hero.image + "')";
    document.getElementById("heroTitle").textContent = hero.title;
    document.getElementById("heroDesc").textContent = hero.desc;
  }

  function renderRows(rowsData) {
    var container = document.getElementById("rows");
    container.innerHTML = "";

    rowsData.forEach(function (rowData, rowIdx) {
      var rowEl = document.createElement("div");
      rowEl.className = "row";

      var titleEl = document.createElement("h2");
      titleEl.className = "row-title";
      titleEl.textContent = rowData.title;
      rowEl.appendChild(titleEl);

      var trackEl = document.createElement("div");
      trackEl.className = "row-track";
      trackEl.id = "track-" + rowIdx;

      rowData.items.forEach(function (item) {
        var card = document.createElement("div");
        card.className = "card focusable";
        card.style.backgroundImage = "url('" + item.image + "')";
        card.tabIndex = -1;

        var cardTitle = document.createElement("div");
        cardTitle.className = "card-title";
        cardTitle.textContent = item.title;
        card.appendChild(cardTitle);

        card.addEventListener("click", function () {
          if (item.youtubeId) {
            PLAYER.open(item.youtubeId);
          } else {
            // Punto de integración: abrir pantalla de reproducción/detalle para item.id
            console.log("Abrir contenido:", item.id);
          }
        });

        trackEl.appendChild(card);
      });

      rowEl.appendChild(trackEl);
      container.appendChild(rowEl);
    });
  }

  function scrollRowToCard(card, trackEl) {
    var gap = parseFloat(getComputedStyle(trackEl).columnGap) || 0;
    var cardWidth = card.offsetWidth + gap;
    var index = Array.prototype.indexOf.call(trackEl.children, card);
    var visibleCount = Math.floor(trackEl.parentElement.offsetWidth / cardWidth);
    var offset = Math.max(0, index - Math.floor(visibleCount / 2));
    trackEl.style.transform = "translateX(-" + (offset * cardWidth) + "px)";
  }

  function buildNavRows() {
    var navRows = [];

    navRows.push(Array.prototype.slice.call(document.querySelectorAll(".topnav .focusable")));
    navRows.push(Array.prototype.slice.call(document.querySelectorAll(".hero-actions .focusable")));

    document.querySelectorAll("#rows .row-track").forEach(function (track) {
      navRows.push(Array.prototype.slice.call(track.querySelectorAll(".focusable")));
    });

    return navRows;
  }

  function restoreMainNav() {
    NAV.setRows(buildNavRows());
    NAV.applyFocus();
  }

  function init() {
    requestFullscreenOnFirstInput();
    registerTizenBackKey();
    renderHero(CATALOG.hero);
    renderRows(CATALOG.rows);
    SEARCH.init();
    PLAYER.init();

    NAV.init();
    NAV.setRows(buildNavRows());
    NAV.setFocusChangeHandler(function (el) {
      var track = el.closest(".row-track");
      if (track) scrollRowToCard(el, track);
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    NAV.setBackHandler(function () {
      if (PLAYER.isOpen()) {
        PLAYER.close();
      } else if (SEARCH.isOpen()) {
        SEARCH.close();
      } else {
        exitApp();
      }
    });
    NAV.applyFocus();

    document.getElementById("searchBtn").addEventListener("click", SEARCH.open);
  }

  window.APP = {
    buildNavRows: buildNavRows,
    scrollRowToCard: scrollRowToCard,
    restoreMainNav: restoreMainNav
  };

  document.addEventListener("DOMContentLoaded", init);
})();
