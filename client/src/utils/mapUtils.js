import L from 'leaflet';

let map; // Declare a global variable to store the map instance

export const displayMap = (locations) => {
  // Check if a map instance already exists and remove it
  if (map) {
    map.remove(); // Destroys the existing map instance
  }

  // Initialize the map
  map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};
