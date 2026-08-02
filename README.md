# Invitación de matrimonio — Yelena y Guillermo

Sitio web estático preparado para publicarse en **GitHub Pages**.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube **todo el contenido de esta carpeta**, conservando la carpeta `imagenes`.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main`, la carpeta `/ (root)` y pulsa **Save**.
6. GitHub mostrará la dirección pública cuando termine la publicación.

## Estructura que debes conservar

```text
index.html
style.css
script.js
cancion.mp3
evento-boda.ics
.nojekyll
imagenes/
  portada.jpg
  foto1.jpeg
  foto2.jpeg
  foto3.jpeg
```

## Importante antes de publicar

El número de WhatsApp fue recuperado del código original: `573174343071`.
Confírmalo antes de compartir la invitación. Para cambiarlo, abre `script.js` y edita la constante `WHATSAPP_NUMBER` al comienzo del archivo. Usa el código de país y el número, sin `+`, espacios ni guiones.

La canción empieza cuando el visitante pulsa **Abrir invitación**. Ese clic es necesario para cumplir las restricciones de reproducción automática de los navegadores.
