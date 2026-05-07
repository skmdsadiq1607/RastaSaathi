const { Client } = require('@googlemaps/google-maps-services-js');
const env = require('../config/env');
const { calculateDistanceKm, estimateEtaSeconds } = require('../utils/geoUtils');
const logger = require('../utils/logger');

const client = new Client({});

function hasMapsKey() {
  return Boolean(env.googleMapsApiKey);
}

async function getDistanceMatrix(origin, destination, severityLevel = 'MEDIUM') {
  if (hasMapsKey()) {
    try {
      const response = await client.distancematrix({
        params: {
          key: env.googleMapsApiKey,
          origins: [{ lat: origin.lat, lng: origin.lng }],
          destinations: [{ lat: destination.lat, lng: destination.lng }],
          mode: 'driving',
          departure_time: 'now',
          traffic_model: 'best_guess'
        },
        timeout: 5000
      });
      const element = response.data.rows[0].elements[0];
      if (element.status === 'OK') {
        return {
          etaSeconds: element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value,
          distanceMeters: element.distance.value,
          source: 'google-distance-matrix'
        };
      }
    } catch (error) {
      logger.warn('Google Distance Matrix failed', { message: error.message });
    }
  }
  const distanceKm = calculateDistanceKm(origin, destination);
  return {
    etaSeconds: estimateEtaSeconds(distanceKm, severityLevel),
    distanceMeters: Math.round(distanceKm * 1000),
    source: 'haversine-estimate'
  };
}

async function getDirections(origin, destination, severityLevel = 'MEDIUM') {
  if (hasMapsKey()) {
    try {
      const response = await client.directions({
        params: {
          key: env.googleMapsApiKey,
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          mode: 'driving',
          alternatives: true,
          departure_time: 'now',
          traffic_model: 'best_guess',
          avoid: severityLevel === 'CRITICAL' ? ['tolls'] : []
        },
        timeout: 5000
      });
      const routes = response.data.routes || [];
      if (routes.length) {
        const primary = routes[0];
        const leg = primary.legs[0];
        return {
          polyline: primary.overview_polyline.points,
          etaSeconds: leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value,
          distanceMeters: leg.distance.value,
          alternateRoutes: routes.slice(1, 4).map((route) => ({
            polyline: route.overview_polyline.points,
            etaSeconds: route.legs[0].duration.value,
            distanceMeters: route.legs[0].distance.value,
            summary: route.summary
          })),
          source: 'google-directions'
        };
      }
    } catch (error) {
      logger.warn('Google Directions failed', { message: error.message });
    }
  }
  const matrix = await getDistanceMatrix(origin, destination, severityLevel);
  return {
    polyline: '',
    etaSeconds: matrix.etaSeconds,
    distanceMeters: matrix.distanceMeters,
    alternateRoutes: [],
    source: matrix.source
  };
}

module.exports = { getDistanceMatrix, getDirections };
