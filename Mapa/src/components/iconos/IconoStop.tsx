import L from "leaflet";
// Creamos un nuevo icono divIcon para cada parada
export const customStopIcon = L.divIcon({
    className: "custom-stop-icon", // Clase CSS para estilizar si quieres
    html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%; border: 1px solid white;"></div>', // Círculo azul más pequeño
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -5],
  });
  