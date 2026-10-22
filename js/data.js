// Datos de ejemplo del catálogo. Sustituir por una llamada real al backend/API.
var CATALOG = {
  hero: {
    title: "Horizonte Perdido",
    desc: "Un grupo de exploradores descubre un mundo oculto donde cada decisión cambia el destino de la humanidad.",
    image: "https://picsum.photos/seed/hero/1920/1080"
  },
  rows: [
    {
      title: "Continuar viendo",
      items: makeItems("continue", 8)
    },
    {
      title: "Tendencias ahora",
      items: makeItems("trend", 10)
    },
    {
      title: "Series originales",
      items: makeItems("series", 10)
    },
    {
      title: "Películas de acción",
      items: makeItems("action", 10)
    },
    {
      title: "Recomendado para ti",
      items: makeItems("reco", 10)
    }
  ]
};

// La primera opcion de "Continuar viendo" usa un video real de YouTube:
// miniatura real como preview y reproduccion a pantalla completa al seleccionarla.
CATALOG.rows[0].items[0].youtubeId = "dQw4w9WgXcQ";
CATALOG.rows[0].items[0].image = "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg";

CATALOG.rows[0].items[1].youtubeId = "5Ir6-uQCQK0";
CATALOG.rows[0].items[1].image = "https://img.youtube.com/vi/5Ir6-uQCQK0/hqdefault.jpg";

function makeItems(seedPrefix, count) {
  var items = [];
  for (var i = 1; i <= count; i++) {
    items.push({
      id: seedPrefix + "-" + i,
      title: "Título " + seedPrefix + " " + i,
      image: "https://picsum.photos/seed/" + seedPrefix + i + "/400/225"
    });
  }
  return items;
}
