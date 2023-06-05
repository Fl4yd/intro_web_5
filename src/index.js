import "./styles.css";
import "../leaflet/leaflet"
async function getMigrationData(url) {
  const Promise = await fetch(url);
  return await Promise.json();
}

async function drawMap()  {
  const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const mapPromise = await fetch(url);
  const data = await mapPromise.json();
  const dataMigrationPos = await getMigrationData('https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f');
  const dataMigrationNeg = await getMigrationData('https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e');
  //const names = data.
  console.log(dataMigrationPos)
  console.log(dataMigrationNeg)
  for(let idx = 0; idx < data.features.length; idx++) {
    data.features[idx].properties.posMigration = dataMigrationPos.dataset.value[idx];
    data.features[idx].properties.negMigration = dataMigrationNeg.dataset.value[idx];
  }
  console.log(data.features)
  initMap(data)
};

const getFeature = (feature, layer) => {
  if (!feature.properties.name) return;
  const name = feature.properties.name;
  const pos = feature.properties.posMigration;
  const neg = feature.properties.negMigration;
  layer.bindPopup(`
  <ul>
    <li>Name: ${name}</li>
    <li>Positive migration: ${pos}</li>
    <li>Negative migration: ${neg}</li>
  </ul>
  `)
  layer.bindTooltip(name);
}

const getStyle = (feature) => {
  const pos = feature.properties.posMigration;
  const neg = feature.properties.negMigration;
  let hue = (Math.pow(pos/neg,3)*60 < 120) ? Math.pow(pos/neg,3)*60 : 120;
  return {
    color: `hsl(${hue},75%,50%)`
  }
}

const initMap = (data) => {
  let map = L.map('map', {
    minZoom: -3
  });

  let geoJson = L.geoJSON(data, {
    onEachFeature: getFeature,
    style: getStyle
  }).addTo(map)

  let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map)

  map.fitBounds(geoJson.getBounds());
}

drawMap()
