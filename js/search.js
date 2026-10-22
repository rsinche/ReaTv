// Buscador con teclado en pantalla, navegable con el control remoto (D-pad).
var SEARCH = (function () {
  var KEY_ROWS = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "SPACE", "DEL"]
  ];

  var overlayEl, keyboardEl, queryTextEl, resultsTrackEl, resultsTitleEl, closeBtnEl;
  var query = "";
  var isOpenFlag = false;
  var keyboardBuilt = false;

  function keyLabel(key) {
    if (key === "SPACE") return "Espacio";
    if (key === "DEL") return "⌫ Borrar";
    return key;
  }

  function buildKeyboard() {
    if (keyboardBuilt) return;
    KEY_ROWS.forEach(function (row) {
      var rowEl = document.createElement("div");
      rowEl.className = "key-row";
      row.forEach(function (key) {
        var btn = document.createElement("button");
        btn.className = "key focusable" + (key === "SPACE" || key === "DEL" ? " key-wide" : "");
        btn.textContent = keyLabel(key);
        btn.dataset.key = key;
        btn.addEventListener("click", function () { handleKeyPress(key); });
        rowEl.appendChild(btn);
      });
      keyboardEl.appendChild(rowEl);
    });
    keyboardBuilt = true;
  }

  function handleKeyPress(key) {
    if (key === "DEL") {
      query = query.slice(0, -1);
    } else if (key === "SPACE") {
      query += " ";
    } else {
      query += key;
    }
    renderQuery();
    renderResults();
    refreshNavRows();
  }

  function renderQuery() {
    queryTextEl.textContent = query;
  }

  function flattenCatalog() {
    var all = [];
    CATALOG.rows.forEach(function (row) {
      row.items.forEach(function (item) { all.push(item); });
    });
    return all;
  }

  function renderResults() {
    resultsTrackEl.innerHTML = "";

    if (!query.trim()) {
      resultsTitleEl.textContent = "Escribe para buscar";
      return;
    }

    var q = query.trim().toLowerCase();
    var matches = flattenCatalog().filter(function (item) {
      return item.title.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 24);

    resultsTitleEl.textContent = matches.length
      ? "Resultados para “" + query.trim() + "”"
      : "Sin resultados para “" + query.trim() + "”";

    matches.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "card focusable";
      card.style.backgroundImage = "url('" + item.image + "')";
      card.tabIndex = -1;

      var cardTitle = document.createElement("div");
      cardTitle.className = "card-title";
      cardTitle.textContent = item.title;
      card.appendChild(cardTitle);

      card.addEventListener("click", function () {
        console.log("Abrir contenido:", item.id);
      });

      resultsTrackEl.appendChild(card);
    });
  }

  function navRows() {
    var rows = [[closeBtnEl]];
    keyboardEl.querySelectorAll(".key-row").forEach(function (rowEl) {
      rows.push(Array.prototype.slice.call(rowEl.querySelectorAll(".focusable")));
    });
    var resultCards = Array.prototype.slice.call(resultsTrackEl.querySelectorAll(".focusable"));
    if (resultCards.length) rows.push(resultCards);
    return rows;
  }

  function refreshNavRows() {
    NAV.setRows(navRows());
    NAV.applyFocus();
  }

  function open() {
    overlayEl.classList.remove("hidden");
    isOpenFlag = true;
    query = "";
    renderQuery();
    renderResults();
    refreshNavRows();
  }

  function close() {
    overlayEl.classList.add("hidden");
    isOpenFlag = false;
    APP.restoreMainNav();
  }

  function isOpen() {
    return isOpenFlag;
  }

  function init() {
    overlayEl = document.getElementById("searchOverlay");
    keyboardEl = document.getElementById("keyboard");
    queryTextEl = document.getElementById("searchQueryText");
    resultsTrackEl = document.getElementById("searchResultsTrack");
    resultsTitleEl = document.getElementById("searchResultsTitle");
    closeBtnEl = document.getElementById("searchCloseBtn");

    buildKeyboard();
    closeBtnEl.addEventListener("click", close);
  }

  return {
    init: init,
    open: open,
    close: close,
    isOpen: isOpen
  };
})();
