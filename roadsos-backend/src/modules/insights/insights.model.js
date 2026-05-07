const mongoose = require('mongoose');

const insightsSchema = new mongoose.Schema(
  {
    period: { type: String, enum: ['7d', '30d', '90d'], required: true, index: true },
    metricDate: { type: Date, required: true, index: true },
    hotspotGeoJson: { type: mongoose.Schema.Types.Mixed, default: {} },
    trends: { type: mongoose.Schema.Types.Mixed, default: {} },
    severityDistribution: { type: mongoose.Schema.Types.Mixed, default: {} },
    avgHospitalEtaByRegion: { type: mongoose.Schema.Types.Mixed, default: {} },
    commonInjuryTypes: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

insightsSchema.index({ period: 1, metricDate: -1 });

module.exports = mongoose.model('InsightsSnapshot', insightsSchema);
