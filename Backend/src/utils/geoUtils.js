function toPoint(lat, lng) {
  return { type: 'Point', coordinates: [Number(lng), Number(lat)] };
}

function fromPoint(point) {
  const [lng, lat] = point.coordinates;
  return { lat, lng };
}

function calculateDistanceKm(origin, destination) {
  const earthRadiusKm = 6371;
  const lat1 = Number(origin.lat) * (Math.PI / 180);
  const lat2 = Number(destination.lat) * (Math.PI / 180);
  const deltaLat = (Number(destination.lat) - Number(origin.lat)) * (Math.PI / 180);
  const deltaLng = (Number(destination.lng) - Number(origin.lng)) * (Math.PI / 180);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateEtaSeconds(distanceKm, severityLevel = 'MEDIUM') {
  const speeds = { CRITICAL: 50, HIGH: 42, MEDIUM: 34, LOW: 28 };
  const speedKph = speeds[severityLevel] || speeds.MEDIUM;
  return Math.max(120, Math.round((distanceKm / speedKph) * 3600));
}

function roundCoordinate(value, precision = 3) {
  const scale = 10 ** precision;
  return Math.round(Number(value) * scale) / scale;
}

module.exports = { toPoint, fromPoint, calculateDistanceKm, estimateEtaSeconds, roundCoordinate };
