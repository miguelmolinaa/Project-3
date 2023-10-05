document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map at the beginning
    const map = L.map("map").setView([29.7604, -95.3698], 5);
    // Set the Mapbox tile layer
    const mapboxTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data © <a href='https://www.mapbox.com/'>Mapbox</a> contributors",
      maxZoom: 18,
      id: "mapbox/satellite-streets-v11", // Specify the Mapbox style ID
      accessToken: "pk.eyJ1IjoiY3BpbWVudGVsMTUiLCJhIjoiY2xuMTBxbDc4MXhyZjJrbnRvNTF2a2h6NiJ9.g_yMQ4MLNN4zMajTjjhnXw"
    });
    mapboxTileLayer.addTo(map); // Add the tile layer to the map
    // Load JSON data and create the map with markers
    d3.json("Resources/all-listing-gecodio.json").then(function (data) {
      const markerGroup = createPropertyMap(data, map);
      markerGroup.addTo(map);
    });
    function createPropertyMap(data, map) {
      const markers = []; // Array to store markers
      data.forEach((property) => {
        if (property.Latitude && property.Longitude) {
          const popupContent = `
            <b>Full Address:</b> ${property.Address}<br>
            <b>Price:</b> ${property.Price}<br>
            <b>Property Type:</b> ${property["Property Type"]}<br>
            <b>Beds:</b> ${property.Beds}<br>
            <b>Baths:</b> ${property.Baths}<br>
            <b>Year Built:</b> ${property["Year Built"]}<br>
          `;
          const marker = L.marker([parseFloat(property.Latitude), parseFloat(property.Longitude)])
            .bindPopup(popupContent);
          markers.push(marker);
        }
      });
      const markerGroup = L.layerGroup(markers);
      return markerGroup;
    }
  });