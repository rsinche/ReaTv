// Motor de navegación por control remoto (D-pad) para Tizen Smart TV.
// Cada "fila" de navegación es un array de elementos DOM focusables, en orden horizontal.
// Mover arriba/abajo cambia de fila conservando la posición horizontal más cercana.

var NAV = (function () {
  var rows = [];       // Array<Array<HTMLElement>>
  var rowIndex = 0;
  var colIndex = 0;
  var onFocusChange = null;
  var backHandler = null;

  function setRows(newRows) {
    rows = newRows;
    rowIndex = Math.min(rowIndex, rows.length - 1);
    colIndex = Math.min(colIndex, rows[rowIndex].length - 1);
  }

  function currentElement() {
    if (!rows[rowIndex]) return null;
    return rows[rowIndex][colIndex];
  }

  function applyFocus() {
    var all = document.querySelectorAll(".focused");
    all.forEach(function (el) { el.classList.remove("focused"); });
    var el = currentElement();
    if (el) {
      el.classList.add("focused");
      if (typeof onFocusChange === "function") onFocusChange(el, rowIndex, colIndex);
    }
  }

  function move(dir) {
    if (!rows.length) return;
    var targetRow = rowIndex;
    var targetCol = colIndex;

    if (dir === "up") targetRow = Math.max(0, rowIndex - 1);
    else if (dir === "down") targetRow = Math.min(rows.length - 1, rowIndex + 1);
    else if (dir === "left") targetCol = colIndex - 1;
    else if (dir === "right") targetCol = colIndex + 1;

    if (dir === "up" || dir === "down") {
      targetCol = Math.min(colIndex, rows[targetRow].length - 1);
    } else {
      if (targetCol < 0 || targetCol >= rows[rowIndex].length) return; // sin cambio, limite de fila
    }

    rowIndex = targetRow;
    colIndex = targetCol;
    applyFocus();
  }

  function select() {
    var el = currentElement();
    if (el) el.click();
  }

  function setFocusChangeHandler(fn) {
    onFocusChange = fn;
  }

  function setBackHandler(fn) {
    backHandler = fn;
  }

  function init() {
    document.addEventListener("keydown", function (e) {
      switch (e.keyCode) {
        case 37: move("left"); e.preventDefault(); break;   // left
        case 38: move("up"); e.preventDefault(); break;     // up
        case 39: move("right"); e.preventDefault(); break;  // right
        case 40: move("down"); e.preventDefault(); break;   // down
        case 13: select(); e.preventDefault(); break;       // enter / ok
        case 10009: // back (tecla remota Tizen)
          if (typeof backHandler === "function") {
            backHandler();
          } else if (typeof tizen !== "undefined" && tizen.application) {
            tizen.application.getCurrentApplication().exit();
          }
          break;
        default: break;
      }
    });
  }

  return {
    init: init,
    setRows: setRows,
    applyFocus: applyFocus,
    setFocusChangeHandler: setFocusChangeHandler,
    setBackHandler: setBackHandler
  };
})();
