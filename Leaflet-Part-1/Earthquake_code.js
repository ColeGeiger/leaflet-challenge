<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Earthquake Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
         {
            height: 500 px;
        }
    </style>
</head>
<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>

var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

fetch(url)
    .then(response => </script> response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];
                
                // Define marker size based on magnitude
                var markerSize = magnitude * 5;

                // Define marker color based on depth
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
        }).addTo(map);
    });

// Add legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
        '<i style="background: lightgreen"></i> Depth &lt; 30 km<br>' +
        '<i style="background: orange"></i> 30 km &le; Depth &lt; 70 km<br>' +
        '<i style="background: red"></i> Depth &ge; 70 km';
    return div;
};

legend.addTo(map);

</script>

</body>
</html>
