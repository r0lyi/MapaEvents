# Mapa Interactivo de Eventos y Transporte Público

Este proyecto es una aplicación web interactiva desarrollada utilizando **React** y **TypeScript**. Su objetivo principal es ayudar a los usuarios a descubrir eventos en ciudades específicas y visualizar las opciones de transporte público cercanas a la ubicación de dichos eventos en un mapa.

La aplicación integra datos de dos APIs externas para ofrecer una experiencia rica en información geolocalizada:

1.  **Ticketmaster Discovery API:** Utilizada para buscar y obtener información sobre eventos próximos en diferentes ciudades.
2.  **TransitLand API:** Utilizada para acceder a datos de transporte público (como paradas y, potencialmente, rutas y horarios) de diversas agencias a nivel mundial.

El mapa interactivo se implementa con la librería **Leaflet** y su integración con React a través de **react-leaflet**, proporcionando una visualización dinámica y responsiva.

**Características Principales:**

* **Búsqueda de Eventos:** Permite al usuario buscar eventos por nombre de ciudad.
* **Visualización de Eventos:** Muestra los eventos encontrados como marcadores personalizados en el mapa, con popups que ofrecen detalles del evento.
* **Búsqueda de Transporte Cercano:** Al seleccionar un evento, ofrece la opción de encontrar y mostrar paradas de transporte público en las inmediaciones.
* **Visualización de Paradas:** Muestra las paradas de transporte cercanas como un tipo de marcador diferente, con popups que incluyen información básica de la parada (nombre, código GTFS, URL).

Este proyecto sirve como un ejemplo práctico de cómo integrar múltiples fuentes de datos externas (APIs) y visualizarlas geográficamente en una aplicación web moderna.


