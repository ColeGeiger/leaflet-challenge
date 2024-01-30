
function initializeMap() {
  var map = L.map('map').setView([0, 0], 2);

  // Base maps
  var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  var grayscaleMap = L.tileLayer('https://{s}.tile.grayscale.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  // Add base maps to layer control
  var baseMaps = {
    "Street Map": streetMap,
    "Grayscale Map": grayscaleMap
  };

  // Overlay maps
  var earthquakes = L.layerGroup();
  var tectonicPlates = L.layerGroup();

  // Add overlay maps to layer control
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Add layer controls
  L.control.layers(baseMaps, overlayMaps).addTo(map);

  // Set default base map
  streetMap.addTo(map);

  // Load earthquake data
  var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  fetch(earthquakeUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Earthquake data:', data);  // Log the data to console
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];

          var markerSize = magnitude * 5;
          var markerColor = depth < 30 ? 'lightgreen' :
                            depth < 70 ? 'orange' :
                                         'red';

          return L.circleMarker(latlng, {
            radius: markerSize,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.7
          }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km`);
        }
      }).addTo(earthquakes);
    })
    .catch(error => {
      console.error('Error loading earthquake data:', error);
    });

  // Load tectonic plates data
  var tectonicPlatesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
  fetch(tectonicPlatesUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Tectonic plates data:', data);  // Log the data to console
      L.geoJSON(data, {
        style: function (feature) {
          return {
            color: 'orange',
            weight: 2
          };
        }
      }).addTo(tectonicPlates);
    })
    .catch(error => {
      console.error('Error loading tectonic plates data:', error);
    });
}

// Call the initializeMap function when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initializeMap();
});




  