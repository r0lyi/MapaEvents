import L from "leaflet";
// Icono personalizado para EVENTOS (círculo rojo)
export const customEventIcon = L.divIcon({
  className: "event-marker-icon", // Usar la clase definida en MapIcons.css
  html: '<div class="event-marker-icon-inner"></div>', // Usar la estructura HTML definida en CSS
  iconSize: [38, 46], // Tamaño total del icono (ancho del cuerpo + alto de la cola) -> 30px ancho, 30px cuerpo + 12px cola = 42px total? Ajustemos a 38x46 para que se vea bien.
  iconAnchor: [19, 46], // Punto que ancla el icono a la lat/lng (punta de la cola) -> Ancho/2, Alto Total
  popupAnchor: [0, -40], // Punto donde el popup se ancla al icono (justo encima de la punta)
});
