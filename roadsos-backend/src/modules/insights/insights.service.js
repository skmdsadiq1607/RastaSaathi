const Incident = require('../incident/incident.model');
const { roundCoordinate } = require('../../utils/geoUtils');

function periodStart(period) {
  const days = period === '90d' ? 90 : period === '7d' ? 7 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function hotspots(period = '30d') {
  const start = periodStart(period);
  const incidents = await Incident.find({ createdAt: { $gte: start } });
  const buckets = new Map();
  for (const incident of incidents) {
    const [lng, lat] = incident.location.coordinates;
    const key = roundCoordinate(lat) + ',' + roundCoordinate(lng);
    const current = buckets.get(key) || { lat: roundCoordinate(lat), lng: roundCoordinate(lng), count: 0, severities: {} };
    current.count += 1;
    current.severities[incident.severity.level] = (current.severities[incident.severity.level] || 0) + 1;
    buckets.set(key, current);
  }
  return {
    type: 'FeatureCollection',
    features: [...buckets.values()].map((bucket) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [bucket.lng, bucket.lat] }, properties: { count: bucket.count, severities: bucket.severities } }))
  };
}

async function trends(period = '30d') {
  const start = periodStart(period);
  const incidents = await Incident.find({ createdAt: { $gte: start } }).populate('selectedHospital');
  const daily = {};
  const severityDistribution = {};
  const injuryTypes = {};
  const etaByRegion = {};
  for (const incident of incidents) {
    const day = incident.createdAt.toISOString().slice(0, 10);
    daily[day] = (daily[day] || 0) + 1;
    severityDistribution[incident.severity.level] = (severityDistribution[incident.severity.level] || 0) + 1;
    injuryTypes[incident.injuryType] = (injuryTypes[incident.injuryType] || 0) + 1;
    const region = incident.selectedHospital ? incident.selectedHospital.region : 'unassigned';
    etaByRegion[region] = etaByRegion[region] || [];
    if (incident.route.etaSeconds) etaByRegion[region].push(incident.route.etaSeconds);
  }
  return {
    period,
    daily: Object.entries(daily).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    severityDistribution,
    avgHospitalEtaByRegion: Object.fromEntries(Object.entries(etaByRegion).map(([region, values]) => [region, values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0])),
    commonInjuryTypes: Object.entries(injuryTypes).map(([injuryType, count]) => ({ injuryType, count })).sort((a, b) => b.count - a.count).slice(0, 5)
  };
}

module.exports = { hotspots, trends };
