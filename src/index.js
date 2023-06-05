import "./styles.css";
import "../leaflet/leaflet"


async function drawMap()  {
  const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const mapPromise = await fetch(url);
  const data = await mapPromise.json();
  console.log(data)
  initMap(data)
};

const getFeature = (feature, layer) => {
  if (!feature.properties.id) return;
  const id = feature.properties.id;
  console.log(id)
  layer.bindTooltip("Hello " + id);
}

const initMap = (data) => {
  let map = L.map('map', {
    minZoom: -3
  });

  let geoJson = L.geoJSON(data, {
    onEachFeature: getFeature
  }).addTo(map)

  let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: "OpenStreetMap"
  }).addTo(map)

  map.fitBounds(geoJson.getBounds());
}

drawMap()
