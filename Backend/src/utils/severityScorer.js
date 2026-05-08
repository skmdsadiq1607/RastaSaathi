const { SEVERITY_LEVELS } = require('./constants');

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function vehicleRisk(vehicleType = 'two-wheeler') {
  const weights = { pedestrian: 95, 'two-wheeler': 88, bicycle: 78, auto: 58, car: 48, bus: 62, truck: 72 };
  return weights[String(vehicleType).toLowerCase()] || 55;
}

function consciousnessRisk(level = 'conscious') {
  const weights = { unconscious: 100, confused: 78, drowsy: 68, conscious: 25, alert: 12 };
  return weights[String(level).toLowerCase()] || 45;
}

function injuryRisk(description = '') {
  const text = String(description).toLowerCase();
  const rules = [
    [/not breathing|no pulse|cardiac|severe bleeding|head injury|spine|unconscious/, 100],
    [/bleeding|fracture|chest|burn|trapped|crush/, 82],
    [/dizzy|vomit|deep cut|pain|swelling/, 58],
    [/scratch|minor|bruise/, 24]
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  return match ? match[1] : 45;
}

function calculateSeverityScore(input) {
  const speedRisk = clamp((Number(input.speed || 0) / 120) * 100);
  const impactRisk = clamp((Number(input.impactForce || 0) / 8) * 100);
  const ageRisk = Number(input.age || 30) < 12 || Number(input.age || 30) > 65 ? 75 : 35;
  const components = {
    speed: speedRisk,
    impact: impactRisk,
    vehicle: vehicleRisk(input.vehicleType),
    injury: injuryRisk(input.injuryDescription),
    consciousness: consciousnessRisk(input.consciousnessLevel),
    age: ageRisk
  };
  const score = clamp(
    components.speed * 0.18 +
      components.impact * 0.24 +
      components.vehicle * 0.12 +
      components.injury * 0.24 +
      components.consciousness * 0.16 +
      components.age * 0.06
  );
  let level = SEVERITY_LEVELS.LOW;
  if (score >= 86) level = SEVERITY_LEVELS.CRITICAL;
  else if (score >= 61) level = SEVERITY_LEVELS.HIGH;
  else if (score >= 31) level = SEVERITY_LEVELS.MEDIUM;
  return { score: Math.round(score), level, components };
}

function recommendedResponse(level) {
  const responses = {
    CRITICAL: 'Dispatch advanced life support ambulance, alert trauma center, prepare ICU and blood support.',
    HIGH: 'Dispatch ambulance immediately, route to trauma-capable hospital, monitor vitals continuously.',
    MEDIUM: 'Dispatch nearest responder, arrange emergency department evaluation, provide guided first aid.',
    LOW: 'Advise on first aid, keep responder on standby, monitor for escalation symptoms.'
  };
  return responses[level] || responses.LOW;
}

module.exports = { calculateSeverityScore, recommendedResponse };
