// src/components/SpainMap.tsx
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { StopProperties } from "../type/StopProperties";
import { FeatureCollection } from "geojson";
import { Event } from "../type/EventProps";
import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SpainMap.css";
import "./MapIocns.css";
import { customEventIcon } from "./iconos/IconoEvento";
import { customStopIcon } from "./iconos/IconoStop";

const spainCenter: [number, number] = [40.4637, -3.7492];  
const initialZoom = 6;

const SpainMap: React.FC = () => {
  // Estados para la búsqueda de Eventos (Ticketmaster)
  const [city, setCity] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null); 

  // --- Estados para la búsqueda de Paradas de Transporte (TransitLand) ---
  const [transitStopsGeoJSON, setTransitStopsGeoJSON] =
    useState<FeatureCollection | null>(null);
  const [transitError, setTransitError] = useState<string | null>(null); 

  // Función para buscar eventos usando la API de Ticketmaster 
  const fetchEvents = async (cityName: string) => {
    /*Funcion asincrona para eventos que recibe nombre de la
    la ciudad como argumento */
    setError(null); // Limpiar errores anteriores
    setEvents([]);  // Limpiar eventos anteriores

    const apiKey = "t2Ov2cfA96bu8wVAZRgiRoiTb0V0g6xF"; 
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityName}&countryCode=ES&size=100`;

    try {
      const response = await fetch(apiUrl);
      // Comprobamos si la respuesta es correcta
      if (!response.ok) {
        setError(`Error en la API de Ticketmaster`);
      }
      // Procesa la respuesta JSON
      const data = await response.json();
      const fetchedEvents: Event[] = data._embedded?.events || [];
      setEvents(fetchedEvents);
      if (fetchedEvents.length === 0 && data.page?.totalElements === 0) {
        setError(`No se encontraron eventos para "${cityName}".`);
      }
    } catch (e) {
      setError(`No se pudieron cargar los eventos`);
      setEvents([]);
    }
  };

  // Función para buscar PARADAS cercanas usando TransitLand API REST 
  //Logica de la preparación de Petición
  const fetchtStops = async (latitude: number, longitude: number) => {
    setTransitError(null);
    setTransitStopsGeoJSON(null); 

    const transitLandEndpoint =
      "https://api.transit.land/api/v2/rest/stops.geojson"; 
    const queryParams = new URLSearchParams({
      lat: latitude.toString(), //Pasar a string
      lon: longitude.toString(),  //Pasar a string
      radius: "500", // Parámetro para el radio de la búsqueda (500 metros)
      apikey: "bgga1tYF6Oz9VkS6QfB0vkF03Ds6C9qh", // Parámetro 'apikey'
      limit: "20", // Limitar el número de paradas para no sobrecargar el mapa
      // Puedes añadir otros parámetros para filtrar paradas (ej. por tipo de vehículo)
    }).toString();

    // Utiliza el endpoint /stops.geojson con lat, lon, radius, limit y apikey
    const apiUrl = `${transitLandEndpoint}?${queryParams}`;

    try {
      // Realiza la petición a la API de TransitLand
      const response = await fetch(apiUrl);

      if (!response.ok) { 
        setTransitError(`Error en la API de TransitLand`);
      }
      const geoJsonData: FeatureCollection = await response.json();

      if (geoJsonData.features.length > 0) {
        setTransitStopsGeoJSON(geoJsonData); // Guarda las paradas GeoJSON
        setTransitError(null);
      } else {
        setTransitStopsGeoJSON(null);
        setTransitError(
          `No se encontraron paradas de transporte cerca 500 m).`
        );
      }
    } catch (e) {
      setTransitError(`No se pudieron cargar las paradas de transporte`);
      setTransitStopsGeoJSON(null);
    }
  };

  // --- Funciones para manejar la búsqueda de eventos ---
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    if (city) {
      fetchEvents(city);
      // Limpiar paradas y errores de TransitLand al buscar una nueva ciudad
      setTransitStopsGeoJSON(null);
      setTransitError(null);
    }
  };

  const getEventImageUrl = (event: Event): string | undefined => {
    // Acceder al array de imágenes del evento
    const images = event.images;

    // 1. Comprobar si el array de imágenes existe y no está vacío.
    if (!images || images.length === 0) {
      return undefined;
    }

    // 2. Intentar encontrar una imagen que sea "adecuada" para mostrar:
    // a) Que tenga definida la propiedad 'width' (ancho).
    // b) Que su ancho ('width') sea mayor a 200 píxeles (para asegurar una calidad mínima en el popup).
    // c) Que tenga definida la propiedad 'url'.
    const suitableImage = images.find(
      (img) => img.width && img.width > 200 && img.url
    );

    // Si encontramos una imagen que cumple los criterios de "adecuada", retornamos su URL.
    if (suitableImage) {
      return suitableImage.url;
    }

    // 3. Si no encontramos una imagen "adecuada" (ancha), intentar encontrar una con ratio "16_9".
    const wideImage = images.find((img) => img.ratio === "16_9" && img.url);
    // Si encontramos una imagen con ratio "16_9", retornamos su URL.
    if (wideImage) {
      return wideImage.url;
    }
    // 4. Si no encontramos una imagen que cumpla los criterios anteriores,
    if (images.length > 0 && images[0].url) {
      return images[0].url;
    }
    return undefined;

  };


  return (
    <div className="spain-map-container">

      {/* Controles de búsqueda */}
      <div className="search-controls">
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Introduce ciudad de España"
        />


        <button onClick={handleSearch}>{"Buscar Eventos"}</button>
        {error && <div className="error-message">{error}</div>}
        {/* Error de Ticketmaster */}
      </div>

      {/* Contenedor del mapa */}
      <div id="map-container">
        <MapContainer
          center={spainCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Mensaje de error para TransitLand */}
          {transitError && (
            <div className="error-message transit-error-message">
              {transitError}
            </div>
          )}

          {/* Para dibujar los Marcadores de Eventos */}
          {events.map((event) => {
            const venueLocation = event._embedded?.venues?.[0]?.location;
            if (
              venueLocation &&
              venueLocation.latitude &&
              venueLocation.longitude
            ) {
              const lat = parseFloat(venueLocation.latitude);
              const lng = parseFloat(venueLocation.longitude);
              if (!isNaN(lat) && !isNaN(lng)) {
                const position: [number, number] = [lat, lng];
                const venue = event._embedded?.venues?.[0];
                const imageUrl = getEventImageUrl(event);

                return (
                  <Marker
                    key={event.id}
                    position={position}
                    icon={customEventIcon}
                  >
                    <Popup>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`Imagen del evento ${event.name}`}
                          style={{
                            maxWidth: "200px",
                            height: "auto",
                            marginBottom: "10px",
                          }}
                        />
                      )}
                      <strong>{event.name}</strong>
                      <br />
                      Fecha: {event.dates.start.localDate}{" "}
                      {event.dates.start.localTime || ""}
                      <br />
                      Lugar: {venue?.name} ({venue?.city?.name})<br />
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Más detalles
                      </a>
                      <br />
                      {/* Botón para mostrar PARADAS CERCANAS */}
                      <button
                        onClick={() => {
                          if (!isNaN(lat) && !isNaN(lng)) {
                            fetchtStops(lat, lng); // <-- Llama a la función que busca paradas
                          } else {
                            console.error(
                              "Coordenadas del evento no válidas para buscar transporte."
                            );
                          }
                        }}
                        style={{ marginTop: "10px", padding: "5px 10px" }}
                      >
                        {"Mostrar Paradas Cercanas"}
                      </button>
                      {/* No mostramos errores de salida aquí, solo el error general de búsqueda de paradas */}
                    </Popup>
                  </Marker>
                );
              }
            }
            return null;
          })}

          {/* Este componente solo se renderiza si transitStopsGeoJSON no es null */}

          {transitStopsGeoJSON && (
            <GeoJSON
              data={transitStopsGeoJSON}
              // Define cómo dibujar cada punto (parada)
              pointToLayer={(feature, latlng) => {
                // --- Usamos el objeto 'feature' aquí ---
                // Obtenemos las propiedades de la parada
                const props = feature.properties as StopProperties;
                const stopCode = props.stop_code; // Código GTFS
                const stopName = props.stop_name || props.name; // Nombre de la parada (usamos stop_name o name)

                // Contenido para el icono: Código GTFS, primera letra del nombre, o un '?'
                let iconContent = "?";
                if (stopCode) {
                  // Usamos el código GTFS si existe
                  iconContent = stopCode;
                } else if (stopName) {
                  // Si no hay código, usamos la primera letra del nombre en mayúscula
                  iconContent = stopName.charAt(0).toUpperCase();
                }

                // Retornamos un marcador con este icono personalizado
                return L.marker(latlng, { icon: customStopIcon });
              }}
              // Configura qué pasa al hacer clic o interactuar con cada parada
              onEachFeature={(feature, layer) => {
                if (feature.geometry.type === "Point" && feature.properties) {
                  const props = feature.properties as StopProperties;
                  const stopName =
                    props.stop_name || props.name || "Parada sin nombre";

                  // --- MODIFICAR AQUÍ el contenido del popup ---
                  const popupContent = `
                             <strong>${stopName}</strong><br/>
                             ${
                               props.stop_code
                                 ? `Código GTFS: ${props.stop_code}<br/>`
                                 : "Código GTFS no disponible<br/>"
                             } 
                             ${
                               props.stop_url
                                 ? `<a href="${props.stop_url}" target="_blank" rel="noopener noreferrer">URL de la Parada</a>`
                                 : "No hay url disponible"
                             }
                         `;

                  layer.bindPopup(popupContent);
                }
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SpainMap;
