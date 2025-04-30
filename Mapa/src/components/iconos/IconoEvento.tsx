import L from "leaflet";
export const customEventIcon = L.divIcon({
  className: "event-marker-icon", 
  html: '<div class="event-marker-icon-inner"></div>', 
  iconSize: [30, 40], 
  iconAnchor: [20, 40],
  popupAnchor: [0, -40], 
});
