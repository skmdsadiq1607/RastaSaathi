const InsightsSnapshot = require('../modules/insights/insights.model');
const insightsService = require('../modules/insights/insights.service');

async function aggregateInsights(period = '30d') {
  const [hotspotGeoJson, trends] = await Promise.all([insightsService.hotspots(period), insightsService.trends(period)]);
  return InsightsSnapshot.create({ period, metricDate: new Date(), hotspotGeoJson, trends: trends.daily, severityDistribution: trends.severityDistribution, avgHospitalEtaByRegion: trends.avgHospitalEtaByRegion, commonInjuryTypes: trends.commonInjuryTypes });
}

module.exports = { aggregateInsights };
