# ReaTV — Home estilo Netflix para Samsung Smart TV (Tizen)

Samsung Smart TV usa **Tizen OS**, no Android: las apps se empaquetan como `.wgt`
(HTML/CSS/JS), no como `.apk`. Este proyecto ya está en el formato correcto.

## Probar rápido en el navegador (sin TV)
Abre `index.html` directamente en Chrome/Edge y usa las flechas del teclado +
Enter para navegar. Es solo para revisar el diseño; el foco/D-pad real se
prueba en el emulador o la TV.

## Ejecutar en la TV en modo desarrollador

1. **Activar modo desarrollador en la TV**
   - Apps > buscar "Smart Hub" > mantener pulsado el botón central en la app
     de ajustes (o menú 12345 según modelo) hasta que aparezca "Developer mode".
   - Activarlo e introducir la IP de tu PC (la misma red que la TV).
   - Reiniciar la TV.

2. **Instalar Tizen Studio** (herramienta oficial, gratuita):
   https://developer.tizen.org/development/tizen-studio/download
   - Durante la instalación, agregar el paquete "TV Extensions".

3. **Importar el proyecto**
   - Tizen Studio > File > Import > Tizen > "Existing Projects into Workspace"
   - Seleccionar esta carpeta (`ReaTV`).

4. **Conectar la TV**
   - Tizen Studio > pestaña "Device Manager" > "+" > introducir la IP de la TV.
   - Debería aparecer conectada en la lista de dispositivos.

5. **Ejecutar**
   - Clic derecho en el proyecto > Run As > "Tizen Web Application".
   - Seleccionar la TV conectada como destino.
   - Tizen Studio empaqueta (`.wgt`), firma con un certificado de autor y lo
     instala/lanza automáticamente en la TV.

### Alternativa por línea de comandos (tizen-cli)
```
tizen package -t wgt -s <certificate-profile> -- .
sdb connect <IP_DE_LA_TV>
tizen install -n ReaTV.wgt -t <device-id>
tizen run -p ReaTV00001.ReaTV -t <device-id>
```

## Estructura
- `config.xml` — manifiesto Tizen (id de app, privilegios, perfil TV).
- `index.html` — layout del home (barra superior, hero, filas de carruseles).
- `css/style.css` — estilo oscuro tipo Netflix, estados de foco para D-pad.
- `js/data.js` — datos de ejemplo del catálogo (sustituir por API real).
- `js/nav.js` — motor genérico de navegación por control remoto (D-pad).
- `js/app.js` — construye el DOM desde los datos y conecta la navegación.

## Siguientes pasos sugeridos
- Reemplazar `js/data.js` por una llamada real a tu backend/catálogo.
- Conectar `card click` (en `app.js`) a tu pantalla de detalle/reproducción.
- Añadir un icono en `icon/icon.png` (80x80 o 117x117) y referenciarlo de
  nuevo en `config.xml` con `<icon src="icon/icon.png"/>`.
